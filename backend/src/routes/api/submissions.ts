import express, { Request, Response } from "express";
import SubmissionModel from "../../db/submission-schema.js";

const router = express.Router();

/*
 * POST /api/submissions
 * Create a new submission for a problem in a competition.
 * Expects a JSON body with competition, problem, user, language, and sourceCode
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { competition, problem, user, language, sourceCode, verdict } =
      req.body;

    const sub = await SubmissionModel.create({
      competition,
      problem,
      user,
      language,
      sourceCode,
      verdict: verdict ?? "PENDING",
    });

    res.status(201).json(sub);
  } catch (err) {
    console.error("Failed to create submission:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
 * GET /api/submissions/:competitionId/:userEmail
 * Get the last 5 submissions for a specific problem by a user in a competition.
 * Returns an array of submission documents sorted by createdAt in descending order.
 */
router.get(
  "/:competitionId/:problemId/:userEmail",
  async (req: Request, res: Response) => {
    const { competitionId, problemId, userEmail } = req.params;

    try {
      const submissions = await SubmissionModel.find({
        competition: competitionId,
        problem: problemId,
        user: userEmail,
      })
        .sort({ submittedAt: -1 })
        .limit(5)
        .lean();

      res.json(submissions);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
