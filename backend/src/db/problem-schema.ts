import mongoose, { Schema } from "mongoose";

/**
 * Schema for a problem document.
 * Contains metadata about the problem, its function signatures, sample input/output,
 * constraints, and test cases.
 */
const problemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  problemPoints: {
    type: Number,
    required: true,
  },
  problemTag: String,
  hints: [String],

  functionSignatures: {
    cpp: {
      functionName: String,
      parameters: [String],
      returnType: String,
      toString: String,
    },
    java: {
      functionName: String,
      parameters: [String],
      returnType: String,
      toString: String,
    },
    python: {
      functionName: String,
      parameters: [String],
      returnType: String,
      toString: String,
    },
  },

  sampleInput: {
    input: String,
    output: String,
    explanation: String,
  },

  constraints: [String],

  testCases: [
    {
      inputs: [String],
      expectedOutputs: [String],
    },
  ],
});

export default mongoose.model("Problem", problemSchema);
