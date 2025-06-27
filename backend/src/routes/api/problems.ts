import express, { Request, Response } from "express";
import mongoose from "mongoose";
import ProblemModel from "../../db/problem-schema.js";

const router = express.Router();

/*
 * GET /api/problems/:problemId
 * Returns the full problem document.
 */
router.get(
  "/:problemId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { problemId } = req.params;

      // Validate the problemId
      if (!mongoose.Types.ObjectId.isValid(problemId)) {
        res.status(400).json({ error: "Invalid problem id" });
        return;
      }

      // Fetch the problem by ID
      const problem = await ProblemModel.findById(problemId).lean();

      if (!problem) {
        res.status(404).json({ error: "Problem not found" });
        return;
      }

      // Return the problem document
      res.json(problem);
    } catch (err) {
      console.error("Failed to fetch problem:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
