import { ActivityLog } from "@/models/ActivityLog";
import { connectToDatabase } from "@/lib/mongodb";

export async function logActivity(action: string, target: string, actorEmail?: string | null, meta?: Record<string, unknown>) {
  await connectToDatabase();
  await ActivityLog.create({ action, target, actorEmail: actorEmail || "unknown", meta: meta || {} });
}
