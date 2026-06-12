import { Schema, model, models } from "mongoose";

const TranscriptItemSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true }
  },
  { _id: false }
);

const QuoteRequestSchema = new Schema(
  {
    contact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      company: { type: String, default: "" }
    },
    projectType: { type: String, default: "" },
    summary: { type: String, default: "" }, // AI project summary
    estimateText: { type: String, default: "" }, // AI preliminary estimate
    transcript: { type: [TranscriptItemSchema], default: [] },
    sessionId: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    adminNotes: { type: String, default: "" },

    // Set when approved and converted into CRM records.
    clientId: { type: Schema.Types.ObjectId, ref: "Client" },
    projectId: { type: Schema.Types.ObjectId, ref: "ClientProject" }
  },
  { timestamps: true }
);

let QuoteRequest: any;

if (models.QuoteRequest) {
  QuoteRequest = models.QuoteRequest;
} else {
  QuoteRequest = model("QuoteRequest", QuoteRequestSchema);
}

export { QuoteRequest };
