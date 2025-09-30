import express, { Request, Response } from "express";
import { Submission } from "../../types/types";
import { createSubmission, getSubmissions } from "../../db/db-utils";

const router = express.Router();

/*
 * POST /api/submissions
 * Create a new submission for a problem in a competition.
 * Expects a JSON body with competition, problem, user, language, and sourceCode
 */
router.post("/", async (req: Request, res: Response) => {
  const { competition, problem, user, content, verdict } = req.body;
  try {
    const newSubmission: Submission = {
      competition_id: competition,
      problem_id: problem,
      user_id: user,
      content,
      submitted_at: new Date(),
      verdict,
    };
    await createSubmission(newSubmission);
    res.status(201).json({ message: "Submission created successfully" });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error });
  }
});

/*
 * GET /api/submissions/:competitionId/:userId
 * Get the last 5 submissions for a specific problem by a user in a competition.
 * Returns an array of submission documents sorted by createdAt in descending order.
 */
router.get(
  "/:competitionId/:problemId/:userId",
  async (req: Request, res: Response) => {
    const { competitionId, problemId, userId } = req.params;
    try {
      const result = await getSubmissions(
        Number(competitionId),
        Number(problemId),
        Number(userId),
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error });
    }
  },
);

export default router;
