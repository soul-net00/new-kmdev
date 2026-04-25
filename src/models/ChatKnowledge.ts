import { Schema, model, models } from "mongoose";

const ChatKnowledgeSchema = new Schema(
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

ChatKnowledgeSchema.index({ question: "text" });
ChatKnowledgeSchema.index({ keywords: 1 });
ChatKnowledgeSchema.index({ timesUsed: -1 });
ChatKnowledgeSchema.index({ confidence: -1 });
ChatKnowledgeSchema.index({ active: 1, confidence: -1 });

let ChatKnowledge: any;

if (models.ChatKnowledge) {
  ChatKnowledge = models.ChatKnowledge;
} else {
  ChatKnowledge = model("ChatKnowledge", ChatKnowledgeSchema);
}

export { ChatKnowledge };
export default ChatKnowledge;