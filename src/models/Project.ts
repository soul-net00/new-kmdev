import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    category: {
      type: String,
      enum: ["Web", "Desktop", "Database", "Other"],
      default: "Other"
    },
    techStack: [{ type: String }],
    githubUrl: String,
    liveUrl: String,
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

let Project: any;

if (models.Project) {
  Project = models.Project;
} else {
  Project = model("Project", ProjectSchema);
}

export { Project };
export default Project;