import { Schema, model, models } from "mongoose";

const LearnedQASchema = new Schema(
  {
    question: { type: String, required: true },
    normalizedQuestion: { type: String, required: true, index: true },
    answer: { type: String, required: true },
    keywords: [{ type: String }],
    source: {
      type: String,
      enum: ["openrouter", "manual", "learned"],
      default: "learned"
    },
    timesUsed: { type: Number, default: 1 },
    confidence: { type: Number, default: 0.7, min: 0, max: 1 },
    active: { type: Boolean, default: true },
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

LearnedQASchema.index({ question: "text" });
LearnedQASchema.index({ keywords: 1 });
LearnedQASchema.index({ timesUsed: -1 });
LearnedQASchema.index({ confidence: -1 });
LearnedQASchema.index({ active: 1, confidence: -1 });

let LearnedQA: any;

if (models.LearnedQA) {
  LearnedQA = models.LearnedQA;
} else {
  LearnedQA = model("LearnedQA", LearnedQASchema);
}

export { LearnedQA };
export default LearnedQA;