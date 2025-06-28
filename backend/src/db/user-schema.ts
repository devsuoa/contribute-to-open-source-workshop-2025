import mongoose, { Schema } from "mongoose";

/**
 * Schema for a user document.
 * Contains user metadata such as email, nickname, year level, and preferred programming language.
 */
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nick: {
    type: String,
    required: true,
    unique: true,
  },
  yearLevel: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "5+", "Postgraduate"],
    required: true,
  },
  preferredLanguage: {
    type: String,
    enum: ["cpp", "python", "java"],
    required: true,
  },
});

export default mongoose.model("User", userSchema);
