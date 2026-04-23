import { Schema, model, models } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    percentage: { type: Number, required: true },
    group: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "Networking", "Tools"],
      default: "Tools"
    }
  },
  { timestamps: true }
);

let Skill: any;

if (models.Skill) {
  Skill = models.Skill;
} else {
  Skill = model("Skill", SkillSchema);
}

export { Skill };