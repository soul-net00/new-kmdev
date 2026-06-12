import { Schema, model, models } from "mongoose";

const SignatureSchema = new Schema(
  {
    method: { type: String, enum: ["draw", "type", "upload"], required: true },
    data: { type: String, default: "" }, // dataURL (draw/upload) or typed name (type)
    signedBy: { type: String, default: "" },
    signedAt: { type: Date }
  },
  { _id: false }
);

const ClientDocumentSchema = new Schema(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "ClientProject", required: true, index: true },

    // Document type key (see DOCUMENT_TYPES in lib/agency.ts)
    type: { type: String, required: true },
    title: { type: String, required: true },

    // Snapshot of the data used to render the document (so it never changes
    // even if the client/project is later edited).
    snapshot: { type: Schema.Types.Mixed, default: {} },

    status: {
      type: String,
      enum: ["draft", "sent", "viewed", "signed", "approved", "rejected"],
      default: "draft"
    },

    signature: { type: SignatureSchema, default: null },
    approvedAt: { type: Date },
    aiGenerated: { type: Boolean, default: false },
    generatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

let ClientDocument: any;

if (models.ClientDocument) {
  ClientDocument = models.ClientDocument;
} else {
  ClientDocument = model("ClientDocument", ClientDocumentSchema);
}

export { ClientDocument };
