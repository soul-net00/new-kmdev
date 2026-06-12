import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ChatConversation } from "@/models/ChatConversation";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin";

// ADMIN: view recent AI chatbot conversations.
export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));
  const conversations = await ChatConversation.find().sort({ updatedAt: -1 }).limit(limit).lean();
  return NextResponse.json(conversations);
}
