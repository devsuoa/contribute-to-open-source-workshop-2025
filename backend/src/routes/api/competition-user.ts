import express, { Request, Response } from "express";
import { Types } from "mongoose";
import CompetitionUserModel from "../../db/competition-user-schema.js";

const router = express.Router();

/*
 * POST /api/competitions/:competitionId/progress
 * Upsert a competition user document for the given competition and user.
 * Creates a new document if it doesn't exist, or updates the existing one.
 */
router.post("/:competitionId/progress", async (req: Request, res: Response) => {
  const { competitionId } = req.params;
  const { user } = req.body;

  if (!Types.ObjectId.isValid(competitionId)) {
    res.status(400).json({ error: "Invalid competition id" });
  }

  const doc = await CompetitionUserModel.findOneAndUpdate(
    { competition: competitionId, user },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  res.status(201).json(doc);
});

/*
 * GET /api/competitions/:competitionId/progress/:email
 * Get the progress of a user in a specific competition.
 * Returns the CompetitionUser document for the given competition and user email.
 */
router.get(
  "/:competitionId/progress/:email",
  async (req: Request, res: Response) => {
    const { competitionId, email } = req.params;

    if (!Types.ObjectId.isValid(competitionId)) {
      res.status(400).json({ error: "Invalid competition id" });
      return;
    }

    const doc = await CompetitionUserModel.findOne({
      competition: competitionId,
      user: email,
    }).lean();

    if (!doc) {
      res.status(404).json({ error: "Progress not found" });
      return;
    }
    res.json(doc);
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
    const { competitionId, email } = req.params;
    const { problem } = req.body;

    if (
      !Types.ObjectId.isValid(competitionId) ||
      !Types.ObjectId.isValid(problem)
    ) {
      res.status(400).json({ error: "Invalid ids" });
      return;
    }

    const problemOid = new Types.ObjectId(problem);

    const result = await CompetitionUserModel.findOneAndUpdate(
      { competition: competitionId, user: email },
      [
        {
          $set: {
            problems: {
              $let: {
                vars: {
                  matched: {
                    $filter: {
                      input: "$problems",
                      as: "p",
                      cond: { $eq: ["$$p.problem", problemOid] },
                    },
                  },
                },
                in: {
                  $cond: [
                    /* 1️⃣ sub-doc exists → increment (max 3) */
                    { $gt: [{ $size: "$$matched" }, 0] },
                    {
                      $map: {
                        input: "$problems",
                        as: "p",
                        in: {
                          $cond: [
                            { $eq: ["$$p.problem", problemOid] },
                            {
                              $mergeObjects: [
                                "$$p",
                                {
                                  hintsUsed: {
                                    $min: [{ $add: ["$$p.hintsUsed", 1] }, 3],
                                  },
                                },
                              ],
                            },
                            "$$p",
                          ],
                        },
                      },
                    },
                    /* 2️⃣ sub-doc missing → push new entry with hintsUsed = 1 */
                    {
                      $concatArrays: [
                        "$problems",
                        [
                          {
                            problem: problemOid,
                            solved: false,
                            hintsUsed: 1,
                          },
                        ],
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ],
      { new: true, upsert: true },
    ).lean<{ problems: { problem: Types.ObjectId; hintsUsed: number }[] }>();

    const sub = result?.problems.find((p) => p.problem.equals(problemOid));
    if (!sub) {
      res.status(500).json({ error: "Problem sub-doc not found" });
      return;
    }

    res.json({ hintsUsed: sub.hintsUsed });
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
    const { competitionId, email } = req.params;
    const { problem, addPoints = 0 } = req.body;

    if (
      !Types.ObjectId.isValid(competitionId) ||
      !Types.ObjectId.isValid(problem)
    ) {
      res.status(400).json({ error: "Invalid ids" });
      return;
    }

    /* 0️⃣  If already solved, exit early – NO extra points */
    const already = await CompetitionUserModel.exists({
      competition: competitionId,
      user: email,
      "problems.problem": problem,
      "problems.solved": true,
    });
    if (already) {
      res.json({ success: true });
      return;
    }

    /* 1️⃣ Try to mark an existing sub-doc */
    const first = await CompetitionUserModel.updateOne(
      {
        competition: competitionId,
        user: email,
        "problems.problem": problem,
        "problems.solved": false,
      },
      { $set: { "problems.$.solved": true }, $inc: { points: addPoints } },
    );

    if (first.matchedCount > 0) {
      res.json({ success: true });
      return;
    }

    /* 2️⃣ No sub-doc yet → push a new one and add points */
    const second = await CompetitionUserModel.updateOne(
      { competition: competitionId, user: email },
      {
        $push: { problems: { problem, solved: true, hintsUsed: 0 } },
        $inc: { points: addPoints },
        $setOnInsert: {
          competition: competitionId,
          user: email,
        },
      },
      { upsert: true },
    );

    if (second.upsertedCount > 0 || second.modifiedCount > 0) {
      res.json({ success: true });
      return;
    }

    res.status(500).json({ error: "Update failed" });
    return;
  },
);

export default router;
