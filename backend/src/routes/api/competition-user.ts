import express, { Request, Response } from "express";
import {
  createUserCompetitionStatus,
  getUserCompetitionStatus,
  updateUserCompetitionStatus,
  updateUserProblemStatus,
} from "../../db/db-utils";
import { CompetitionUserStatus, UserProblemStatus } from "../../types/types";

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
    res
      .status(200)
      .json({
        message: `Competition user status created for user ${userId} in competition ${competitionId}`,
      });
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
      const result = await getUserCompetitionStatus(
        Number(userId),
        Number(competitionId),
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
);

/*
 * PATCH /api/competitions/:competitionId/progress/:userId/solve
 * Mark a problem as solved for a user in a specific competition.
 * Increments the user's points by addPoints (default 0).
 */
router.patch(
  "/:competitionId/progress/:userId/solve",
  async (req: Request, res: Response) => {
    const { competitionId, userId } = req.params;
    const { problemId, addPoints = 0 } = req.body;
    try {
      const result = await getUserCompetitionStatus(
        Number(userId),
        Number(competitionId),
      );
      if (!result) {
        res
          .status(404)
          .json({
            error: `Competition user status not found for user ${userId} in competition ${competitionId}`,
          });
        return;
      }
      const updatedProblemStatus: UserProblemStatus = {
        user_id: Number(userId),
        problem_id: Number(problemId),
        last_attempt: new Date(),
        solved: true,
      };
      await updateUserProblemStatus(updatedProblemStatus);

      const updatedCompetitionStatus: CompetitionUserStatus = {
        competition_id: result.competition_id,
        user_id: Number(userId),
        points: result.points + addPoints,
      };
      await updateUserCompetitionStatus(updatedCompetitionStatus);

      res
        .status(200)
        .json({
          message: `Problem ${problemId} marked as solved for user ${userId} in competition ${competitionId}`,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
);

export default router;
