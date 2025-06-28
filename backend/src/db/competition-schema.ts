import mongoose, { Schema } from "mongoose";

/**
 * Schema for a competition document.
 * Contains metadata about the competition, its problems, and leaderboard.
 */
const competitionSchema = new Schema(
  {
    name: String,
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    problems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Competition", competitionSchema);
