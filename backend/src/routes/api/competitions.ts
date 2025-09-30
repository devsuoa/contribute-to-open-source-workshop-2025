import express, { Request, Response } from "express";
import { getPastCompetitions, getUpcomingCompetitions, getProblemsByCompetitionId, getCompetitionById, getUserCompetitionStatus } from "../../db/db-utils";
import { Problem } from "../../types/types";

const router = express.Router();

/*
 * GET /api/competitions/past
 * → Returns all competitions that have ended.
 */
router.get("/past", async (req: Request, res: Response) => {
  try {
    const result = await getPastCompetitions();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/*
 * GET /api/competitions/upcoming
 * → Returns all competitions that are upcoming or ongoing.
 */
router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const result = await getUpcomingCompetitions();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/*
 * GET /api/competitions/:competitionId/problems
 * → Returns problems grouped and ordered by tag.
 */
router.get("/:competitionId/problems", async (req: Request, res: Response) => {
  const { competitionId } = req.params;
  const userId = req.query.user as string | undefined;
  try {
    const problems: Problem[] = await getProblemsByCompetitionId(Number(competitionId)) || [];
    if (!userId) {
      res.json({
        solved: [],
        unsolved: problems
      });
      return;
    }
    // Get solved status for each problem
    const status = await getUserCompetitionStatus(Number(userId), Number(competitionId));
    const solvedIds = new Set(
      (status?.problems || [])
        .filter((p) => p.solved)
        .map((p) => p.problem_id)
    );
    const solved: Problem[] = [];
    const unsolved: Problem[] = [];
    problems.forEach((problem) => {
      if (solvedIds.has(problem.id)) {
        solved.push({ ...problem });
      } else {
        unsolved.push({ ...problem });
      }
    });
    res.json({ solved: solved, unsolved: unsolved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/*
 * GET /api/competitions/:competitionId
 * → Returns competition metadata (and optional user points).
 */
router.get("/:competitionId", async (req: Request, res: Response) => {
  const { competitionId } = req.params;
  try {
    const result = await getCompetitionById(Number(competitionId));
    if (!result) {
      res.status(404).json({ error: `Competition ${competitionId} not found` });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// This can be a HARD activity
router.get(
  "/:competitionId/leaderboard",
  async (req: Request, res: Response) => {
    // const { competitionId } = req.params;
    res.status(501).json({ error: "Not implemented" });
  },
);

export default router;
