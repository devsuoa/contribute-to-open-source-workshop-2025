import mongoose, { Schema } from "mongoose";

const competitionSchema = new Schema({
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
  leaderboard: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      points: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

export default mongoose.model("Competition", competitionSchema);
