import express, { Request, Response } from "express";

const router = express.Router();

/*
 * POST /api/submissions
 * Create a new submission for a problem in a competition.
 * Expects a JSON body with competition, problem, user, language, and sourceCode
 */
router.post("/", async (req: Request, res: Response) => {
  // const { competition, problem, user, language, sourceCode, verdict } =
  //   req.body;
  res.status(501).json({ error: "Not implemented" });
});

/*
 * GET /api/submissions/:competitionId/:userEmail
 * Get the last 5 submissions for a specific problem by a user in a competition.
 * Returns an array of submission documents sorted by createdAt in descending order.
 */
router.get(
  "/:competitionId/:problemId/:userEmail",
  async (req: Request, res: Response) => {
    // const { competitionId, problemId, userEmail } = req.params;
    res.status(501).json({ error: "Not implemented" });
  },
);

export default router;
