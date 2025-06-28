import mongoose, { Schema } from "mongoose";

/**
 * Schema for ordering tags in a specific scope.
 */
const tagOrderSchema = new Schema({
  scope: { type: String, default: "global", unique: true },
  order: [{ type: String, required: true }],
});

export default mongoose.model("TagOrder", tagOrderSchema);
