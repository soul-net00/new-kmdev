import { NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { connectToDatabase } from "@/lib/mongodb";
import { ActivityLog } from "@/models/ActivityLog";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20).lean();
  return NextResponse.json(logs);
}
