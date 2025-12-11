import mongoose, { Schema } from "mongoose";

const IdeaSchema = new Schema({
  title: { type: String, required: true },
  mainIdea: { type: String, required: true },
  motivation: { type: String, required: false },
  howToAchieve: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Idea = mongoose.model("Idea", IdeaSchema);
