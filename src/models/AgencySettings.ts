import { Schema, model, models } from "mongoose";

const PricingOptionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    amount: { type: Number, default: 0 },
    recurring: { type: Boolean, default: false },
    description: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const ClauseSchema = new Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, default: "" }
  },
  { _id: false }
);

const AgencySettingsSchema = new Schema(
  {
    companyName: { type: String, default: "KMDev" },
    developerName: { type: String, default: "Kgomotso Mamogale" },
    domain: { type: String, default: "" },
    logo: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    referencePrefix: { type: String, default: "KMDEV" },

    // Pricing builder options (admin configurable)
    pricingOptions: { type: [PricingOptionSchema], default: [] },

    // Contract clauses (admin configurable)
    clauses: { type: [ClauseSchema], default: [] },

    // Signature requirements
    requireSignature: { type: Boolean, default: true },

    // AI assistant controls
    aiGeminiEnabled: { type: Boolean, default: true },
    aiGrokEnabled: { type: Boolean, default: true },
    aiPromptExtra: { type: String, default: "" }
  },
  { timestamps: true }
);

let AgencySettings: any;

if (models.AgencySettings) {
  AgencySettings = models.AgencySettings;
} else {
  AgencySettings = model("AgencySettings", AgencySettingsSchema);
}

export { AgencySettings };
