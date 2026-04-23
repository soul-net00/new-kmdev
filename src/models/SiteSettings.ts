import { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    brandName: { type: String, default: "KMDev" },
    hero: {
      title: String,
      subtitle: String,
      intro: String,
      image: String,
      stats: [{ label: String, value: String }],
      cta: [{ label: String, href: String }]
    },
    about: {
      text: String,
      image: String,
      highlights: [String]
    },
    contact: {
      email: String,
      whatsapp: String
    }
  },
  { timestamps: true }
);

let SiteSettings: any;

if (models.SiteSettings) {
  SiteSettings = models.SiteSettings;
} else {
  SiteSettings = model("SiteSettings", SiteSettingsSchema);
}

export { SiteSettings };