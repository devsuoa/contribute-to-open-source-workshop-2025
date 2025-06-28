import mongoose, { Schema } from "mongoose";

/**
 * Sub-document that tracks one user’s progress on one problem.
 */
const problemProgressSchema = new Schema({
  problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  solved: { type: Boolean, default: false },

  hintsUsed: { type: Number, default: 0, min: 0, max: 3 },
});

/**
 * One document per (competition, user) pair.
 * Holds mutable state (score, hints, solve flags) for fast updates.
 */
const competitionUserSchema = new Schema({
  competition: {
    type: Schema.Types.ObjectId,
    ref: "Competition",
    required: true,
  },
  user: { type: String, required: true },
  points: { type: Number, default: 0 },

  problems: [problemProgressSchema],
});

// Enforce single progress doc per user in a competition
competitionUserSchema.index(
  { competition: 1, user: 1 },
  { unique: true, name: "uniqueUserPerComp" },
);

export default mongoose.model("CompetitionUser", competitionUserSchema);
