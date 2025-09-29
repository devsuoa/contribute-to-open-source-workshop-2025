import express, { Request, Response } from "express";
import { createUserCompetitionStatus, getUserCompetitionStatus, updateUserCompetitionStatus } from "../../db/db-utils";
import { CompetitionUserStatus } from "../../types/types";

const router = express.Router();

/*
 * POST /api/competitions/:competitionId/progress
 * Upsert a competition user document for the given competition and user.
 * Creates a new document if it doesn't exist, or updates the existing one.
 */
router.post("/:competitionId/progress", async (req: Request, res: Response) => {
  const { competitionId } = req.params;
  const { userId } = req.body;
  try {
    await createUserCompetitionStatus(userId, Number(competitionId));
    res.status(200).json({ message: `Competition user status created for user ${userId} in competition ${competitionId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

/*
 * GET /api/competitions/:competitionId/progress/:email
 * Get the progress of a user in a specific competition.
 * Returns the CompetitionUser document for the given competition and user email.
 */
router.get(
  "/:competitionId/progress/:userId",
  async (req: Request, res: Response) => {
    const { competitionId, userId } = req.params;

    try {
      const result = await getUserCompetitionStatus(Number(userId), Number(competitionId));
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
);

/*
 * PATCH /api/competitions/:competitionId/progress/:email/solve
 * Mark a problem as solved for a user in a specific competition.
 * Increments the user's points by addPoints (default 0).
 */
router.patch(
  "/:competitionId/progress/:userId/solve",
  async (req: Request, res: Response) => {
    const { competitionId, userId } = req.params;
    const { problem, addPoints = 0 } = req.body;
    try {
      const result = await getUserCompetitionStatus(Number(userId), Number(competitionId));
      if (!result) {
        res.status(404).json({ error: `Competition user status not found for user ${userId} in competition ${competitionId}` });
        return;
      }
      const alreadySolved = result.problems.find((p) => p.problem_id === problem.id && p.solved);
      if (alreadySolved) {
        res.status(400).json({ error: `Problem ${problem.id} already solved by user ${userId} in competition ${competitionId}` });
        return;
      }
      const updatedStatus: CompetitionUserStatus = {
        competition_id: result.competition_id,
        user_id: result.user_id,
        points: result.points + addPoints,
        problems: result.problems.map((p) =>
          p.problem_id === problem.id
            ? { ...p, solved: true, last_attempt: new Date() }
            : p,
        ),
      };
      await updateUserCompetitionStatus(updatedStatus);
      res.status(200).json({ message: `Problem ${problem.id} marked as solved for user ${userId} in competition ${competitionId}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
);

export default router;
