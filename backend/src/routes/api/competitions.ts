import express, { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import CompetitionModel from "../../db/competition-schema.js";
import TagOrderModel from "../../db/tag-order-schema.js";
import CompetitionUserModel from "../../db/competition-user-schema.js";
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
    const email = req.query.user as string | undefined;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      res.status(400).json({ error: "Invalid competition id" });
      return;
    }

    /* 1️⃣ fetch competition + problems */
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

    /* 2️⃣ if ?user present, build a Set of solved problem ids */
    let solvedSet: Set<string> | null = null;
    if (email) {
      const prog = await CompetitionUserModel.findOne({
        competition: competitionId,
        user: email,
      })
        .select("problems.problem problems.solved")
        .lean<{
          problems: { problem: mongoose.Types.ObjectId; solved: boolean }[];
        } | null>();

      if (prog)
        solvedSet = new Set(
          prog.problems
            .filter((p) => p.solved)
            .map((p) => p.problem.toString()),
        );
    }

    /* 3️⃣ group by tag and attach solved flag */
    const buckets: Record<string, (ProblemLean & { solved?: boolean })[]> = {};
    competition.problems.forEach((p) => {
      const tag = p.problemTag || "Uncategorised";
      const entry = solvedSet
        ? { ...p, solved: solvedSet.has(p._id.toString()) }
        : p;
      (buckets[tag] ??= []).push(entry);
    });

    /* 4️⃣ sort by points inside each tag */
    Object.values(buckets).forEach((arr) =>
      arr.sort((a, b) => a.problemPoints - b.problemPoints),
    );

    /* 5️⃣ order tags, same logic as before */
    const tagDoc =
      (await TagOrderModel.findOne({
        scope: competitionId,
      }).lean<TagOrderLean>()) ||
      (await TagOrderModel.findOne({ scope: "global" }).lean<TagOrderLean>());
    const ORDER: readonly string[] = tagDoc?.order ?? [];

    const ordered: Record<string, (typeof buckets)[string]> = {};
    [
      ...ORDER.filter((t) => t in buckets),
      ...Object.keys(buckets)
        .filter((t) => !ORDER.includes(t))
        .sort(),
    ].forEach((k) => (ordered[k] = buckets[k]));

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
    const email = req.query.user as string | undefined;

    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      res.status(400).json({ error: "Invalid competition id" });
      return;
    }

    /* fetch competition (no leaderboard anymore) */
    const comp = await CompetitionModel.findById(competitionId)
      .select("name startTime endTime")
      .lean<{
        _id: mongoose.Types.ObjectId;
        name: string;
        startTime: Date;
        endTime: Date;
      }>();

    if (!comp) {
      res.status(404).json({ error: "Competition not found" });
      return;
    }

    /* if ?user=email present → look up points in CompetitionUser */
    if (email) {
      const cu = await CompetitionUserModel.findOne({
        competition: competitionId,
        user: email,
      })
        .select("points")
        .lean<{ points: number } | null>();

      res.json({ ...comp, points: cu?.points ?? 0 });
      return;
    }

    res.json(comp);
  } catch (err) {
    console.error("Failed to fetch competition:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/:competitionId/leaderboard",
  async (req: Request, res: Response) => {
    const { competitionId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const page = Math.max(Number(req.query.page) || 1, 1);

    if (!Types.ObjectId.isValid(competitionId)) {
      res.status(400).json({ error: "Invalid competition id" });
      return;
    }

    try {
      const [{ results, total }] = await CompetitionUserModel.aggregate([
        { $match: { competition: new Types.ObjectId(competitionId) } },

        {
          // Join User with Nickname
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "email",
            pipeline: [{ $project: { _id: 0, nick: 1 } }],
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },

        { $project: { _id: 0, nick: "$userInfo.nick", points: 1 } },

        { $sort: { points: -1, nick: 1 } },

        {
          // Paginate + total in a single query
          $facet: {
            results: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            total: [{ $count: "count" }],
          },
        },
        {
          // Reshape total to a plain number
          $addFields: { total: { $arrayElemAt: ["$total.count", 0] } },
        },
      ]);

      /* Attach rank (global, 1-based) */
      const ranked = results.map(
        (r: { nick: string; points: number }, idx: number) => ({
          rank: (page - 1) * limit + idx + 1,
          nick: r.nick,
          points: r.points,
        }),
      );

      res.json({
        total: total ?? ranked.length,
        page,
        limit,
        results: ranked,
      });
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
