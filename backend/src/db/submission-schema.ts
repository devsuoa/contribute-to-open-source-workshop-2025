import mongoose, { Schema } from "mongoose";

/**
 * Schema for a submission document.
 * Contains metadata about the submission, including the competition, problem,
 * user, programming language, source code, verdict, execution time, memory usage,
 * and submission timestamp.
 */
const submissionSchema = new Schema({
  competition: {
    type: Schema.Types.ObjectId,
    ref: "Competition",
    required: true,
  },
  problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  user: { type: String, required: true },

  language: { type: String, required: true },
  sourceCode: { type: String, required: true },

  verdict: {
    type: String,
  },

  execTimeMs: Number,
  memoryKB: Number,
  submittedAt: { type: Date, default: Date.now },
});

submissionSchema.index(
  { user: 1, competition: 1, problem: 1, submittedAt: -1 },
  { name: "latestByUserProblem" },
);

export default mongoose.model("Submission", submissionSchema);
