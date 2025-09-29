import express, { Request, Response } from "express";
import { getPastCompetitions, getUpcomingCompetitions, getProblemsByCompetitionId, getCompetitionById } from "../../db/db-utils";

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
  try {
    const result = getProblemsByCompetitionId(Number(competitionId));
    res.json(result);
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
