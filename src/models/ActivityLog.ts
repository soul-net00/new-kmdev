import { Schema, model, models } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    action: { type: String, required: true },
    target: { type: String, required: true },
    actorEmail: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

let ActivityLog: any;

if (models.ActivityLog) {
  ActivityLog = models.ActivityLog;
} else {
  ActivityLog = model("ActivityLog", ActivityLogSchema);
}

export { ActivityLog };