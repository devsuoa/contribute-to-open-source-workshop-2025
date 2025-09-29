import express, { Request, Response } from "express";
import { getProblemById } from "../../db/db-utils";

const router = express.Router();

/*
 * GET /api/problems/:problemId
 * Returns the full problem document.
 */
router.get(
  "/:problemId",
  async (req: Request, res: Response) => {
    const { problemId } = req.params;
    try {
      const result = await getProblemById(Number(problemId));
      if (!result) {
        res.status(404).json({ error: `Problem ${problemId} not found` });
        return;
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
);

export default router;
