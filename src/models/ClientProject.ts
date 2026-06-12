import { Schema, model, models } from "mongoose";

const PaymentEntrySchema = new Schema(
  {
    label: { type: String, required: true }, // e.g. "Deposit", "Milestone 1", "Final Payment"
    amount: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date },
    method: { type: String, default: "" },
    reference: { type: String, default: "" }
  },
  { _id: true, timestamps: false }
);

const PricingExtraSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    amount: { type: Number, default: 0 },
    recurring: { type: Boolean, default: false }, // true = monthly
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const HandoverItemSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    done: { type: Boolean, default: false }
  },
  { _id: false }
);

const ClientProjectSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true, index: true },
    projectName: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Web" },
    startDate: { type: Date },
    expectedCompletion: { type: Date },
    projectValue: { type: Number, default: 0 },
    notes: { type: String, default: "" },

    // Workflow stage (see WORKFLOW_STAGES in lib/agency.ts)
    status: { type: String, default: "Consultation", index: true },

    // Pricing builder
    basePrice: { type: Number, default: 0 },
    extras: { type: [PricingExtraSchema], default: [] },

    // Payment tracking
    payments: { type: [PaymentEntrySchema], default: [] },

    // Handover checklist
    handover: { type: [HandoverItemSchema], default: [] },
    handoverComplete: { type: Boolean, default: false },

    // Client portal access
    portalEnabled: { type: Boolean, default: true },
    portalPasswordHash: { type: String, default: "" }
  },
  { timestamps: true }
);

let ClientProject: any;

if (models.ClientProject) {
  ClientProject = models.ClientProject;
} else {
  ClientProject = model("ClientProject", ClientProjectSchema);
}

export { ClientProject };
