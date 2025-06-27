import express, { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import CompetitionModel from "../../db/competition-schema.js";
import TagOrderModel from "../../db/tag-order-schema.js";
import "../../db/problem-schema.js";
import {
  ProblemLean,
  CompetitionLean,
  TagOrderLean,
} from "../../types/types.js";

const router = express.Router();

/*
 * GET /api/competitions/past
 * → Returns all competitions that have ended.
 */
router.get("/past", async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const pastCompetitions = await CompetitionModel.find({
      endTime: { $lt: now },
    });
    res.json(pastCompetitions);
  } catch (error) {
    console.error("Failed to fetch past competitions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 * GET /api/competitions/upcoming
 * → Returns all competitions that are upcoming or ongoing.
 */
router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const upcomingCompetitions = await CompetitionModel.find({
      endTime: { $gte: now },
    });
    res.json(upcomingCompetitions);
  } catch (error) {
    console.error("Failed to fetch upcoming competitions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 * GET /api/competitions/:competitionId/problems
 * → Returns problems grouped and ordered by tag.
 */
router.get("/:competitionId/problems", async (req: Request, res: Response) => {
  try {
    const { competitionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      res.status(400).json({ error: "Invalid competition id" });
      return;
    }

    // Fetch competition and populate problems
    const competition = await CompetitionModel.findById(competitionId)
      .populate<{ problems: ProblemLean[] }>({
        path: "problems",
        select: "name problemPoints problemTag",
        options: { lean: true },
      })
      .lean<CompetitionLean>();

    if (!competition) {
      res.status(404).json({ error: "Competition not found" });
      return;
    }

    // Fetch tag order (fallback to global)
    const tagDoc =
      (await TagOrderModel.findOne({
        scope: competitionId,
      }).lean<TagOrderLean>()) ||
      (await TagOrderModel.findOne({ scope: "global" }).lean<TagOrderLean>());
    const ORDER: readonly string[] = tagDoc?.order ?? [];

    // Group problems by tag
    const buckets: Record<string, ProblemLean[]> = {};
    competition.problems.forEach((p) => {
      const tag = p.problemTag || "Uncategorised";
      (buckets[tag] ??= []).push(p);
    });

    // Sort problems in each tag
    Object.values(buckets).forEach((arr) =>
      arr.sort((a, b) => a.problemPoints - b.problemPoints),
    );

    // Order tags
    const orderedKeys: string[] = [
      ...ORDER.filter((t) => t in buckets),
      ...Object.keys(buckets)
        .filter((t) => !ORDER.includes(t))
        .sort(),
    ];

    // Build ordered result
    const ordered: Record<string, ProblemLean[]> = {};
    orderedKeys.forEach((k) => (ordered[k] = buckets[k]));

    res.json(ordered);
  } catch (err) {
    console.error("Failed to fetch competition problems:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 * GET /api/competitions/:competitionId
 * → Returns competition metadata (and optional user points).
 */
router.get("/:competitionId", async (req: Request, res: Response) => {
  try {
    const { competitionId } = req.params;
    const requestingUid = req.query.user as string | undefined;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      res.status(400).json({ error: "Invalid competition id" });
      return;
    }

    // Fetch competition without problem payload
    const competition = await CompetitionModel.findById(competitionId)
      .select("name startTime endTime leaderboard")
      .lean<{
        _id: Types.ObjectId;
        name: string;
        startTime: Date;
        endTime: Date;
        leaderboard: { user: Types.ObjectId | string; points: number }[];
      }>();

    if (!competition) {
      res.status(404).json({ error: "Competition not found" });
      return;
    }

    // If user param present, extract their points
    let points: number | undefined;
    if (requestingUid) {
      const entry = competition.leaderboard.find(
        (e) => String(e.user) === requestingUid,
      );
      points = entry ? entry.points : 0;
    }

    res.json(requestingUid ? { ...competition, points } : competition);
  } catch (err) {
    console.error("Failed to fetch competition:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
