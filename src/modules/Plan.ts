import mongoose, { Schema, model } from "mongoose";

const RoadmapStepSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimate: { type: String },
});

const PlanSchema = new Schema({
  ideaId: { type: Schema.Types.ObjectId, ref: "Idea", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  summary: { type: String, required: true },

  roadmap: { type: [RoadmapStepSchema], default: [] },

  challenges: { type: [String], default: [] },

  improvements: { type: [String], default: [] },

  nextSteps: { type: [String], default: [] },

  createdAt: { type: Date, default: Date.now },
});

export const Plan = mongoose.model("Plan", PlanSchema);
