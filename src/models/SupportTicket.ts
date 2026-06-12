import { Schema, model, models } from "mongoose";

const TicketResponseSchema = new Schema(
  {
    author: { type: String, enum: ["admin", "client"], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const SupportTicketSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "ClientProject", index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    status: { type: String, enum: ["open", "in-progress", "resolved", "closed"], default: "open" },
    attachments: { type: [String], default: [] },
    responses: { type: [TicketResponseSchema], default: [] }
  },
  { timestamps: true }
);

let SupportTicket: any;

if (models.SupportTicket) {
  SupportTicket = models.SupportTicket;
} else {
  SupportTicket = model("SupportTicket", SupportTicketSchema);
}

export { SupportTicket };
