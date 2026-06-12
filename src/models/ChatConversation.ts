import { Schema, model, models } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    provider: { type: String, default: "" }, // gemini | grok | offline | learned | ""
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ChatConversationSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    messages: { type: [ChatMessageSchema], default: [] },
    // Lightweight intake capture (filled as the consultant flow progresses)
    intent: { type: String, default: "" },
    contact: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      company: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

let ChatConversation: any;

if (models.ChatConversation) {
  ChatConversation = models.ChatConversation;
} else {
  ChatConversation = model("ChatConversation", ChatConversationSchema);
}

export { ChatConversation };
