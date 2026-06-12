import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SupportTicket } from "@/models/SupportTicket";
import { requireAdmin, unauthorizedResponse, badRequestResponse } from "@/lib/admin";
import { trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const status = searchParams.get("status");
  const filter: Record<string, unknown> = {};
  if (clientId) filter.clientId = clientId;
  if (status) filter.status = status;

  const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  // Admin-created ticket (clients create via the portal route).
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const body = await request.json();
  const clientId = trimString(body.clientId);
  const subject = trimString(body.subject);
  const message = trimString(body.message);

  if (!clientId || !subject || !message) {
    return badRequestResponse("clientId, subject and message are required.");
  }

  const ticket = await SupportTicket.create({
    clientId,
    projectId: trimString(body.projectId) || undefined,
    subject,
    message,
    priority: ["low", "normal", "high"].includes(body.priority) ? body.priority : "normal"
  });

  await logActivity("create", "ticket", session.user?.email, { clientId, subject });
  return NextResponse.json(ticket, { status: 201 });
}
