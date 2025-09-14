import express, { Request, Response } from "express";

const router = express.Router();

/*
 * GET /api/problems/:problemId
 * Returns the full problem document.
 */
router.get(
  "/:problemId",
  async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({ error: "Not implemented" });
  },
);

export default router;
