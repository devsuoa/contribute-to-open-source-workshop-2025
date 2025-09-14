import express, { Request, Response } from "express";

const router = express.Router();

/*
 * POST /api/competitions/:competitionId/progress
 * Upsert a competition user document for the given competition and user.
 * Creates a new document if it doesn't exist, or updates the existing one.
 */
router.post("/:competitionId/progress", async (req: Request, res: Response) => {
  // const { competitionId } = req.params;
  // const { user } = req.body;
  res.status(501).json({ error: "Not implemented" });
});

/*
 * GET /api/competitions/:competitionId/progress/:email
 * Get the progress of a user in a specific competition.
 * Returns the CompetitionUser document for the given competition and user email.
 */
router.get(
  "/:competitionId/progress/:email",
  async (req: Request, res: Response) => {
    // const { competitionId, email } = req.params;

    res.status(501).json({ error: "Not implemented" });
  },
);

/*
 * PATCH /api/competitions/:competitionId/progress/:email/hints
 * Increment the hintsUsed count for a specific problem in the user's competition progress.
 * If the problem sub-document does not exist, it creates a new one with hintsUsed = 1.
 */
router.patch(
  "/:competitionId/progress/:email/hints",
  async (req: Request, res: Response) => {
    // const { competitionId, email } = req.params;
    // const { problem } = req.body;

    res.status(501).json({ error: "Not implemented" });
  },
);

/*
 * PATCH /api/competitions/:competitionId/progress/:email/solve
 * Mark a problem as solved for a user in a specific competition.
 * Increments the user's points by addPoints (default 0).
 */
router.patch(
  "/:competitionId/progress/:email/solve",
  async (req: Request, res: Response) => {
    // const { competitionId, email } = req.params;
    // const { problem, addPoints = 0 } = req.body;

    res.status(501).json({ error: "Not implemented" });
    return;
  },
);

export default router;
