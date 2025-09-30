import express, { Request, Response } from "express";
import { getPastCompetitions, getUpcomingCompetitions, getProblemsByCompetitionId, getCompetitionById, getUserProblemStatus } from "../../db/db-utils";
import { Problem, UserProblemStatus } from "../../types/types";

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
    const userProblemStatuses: UserProblemStatus[] = [];
    for (const problem of problems) {
      const status = await getUserProblemStatus(Number(userId), problem.id);
      if (status) {
        userProblemStatuses.push(status);
      }
    }

    const solvedIds = new Set(userProblemStatuses.filter(s => s.solved).map(s => s.problem_id));
    const solved: Problem[] = problems.filter(problem => solvedIds.has(problem.id));
    const unsolved: Problem[] = problems.filter(problem => !solvedIds.has(problem.id));
    res.json({ solved, unsolved });
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
