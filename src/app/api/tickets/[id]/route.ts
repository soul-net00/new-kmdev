import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SupportTicket } from "@/models/SupportTicket";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

const VALID_STATUS = ["open", "in-progress", "resolved", "closed"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const body = await request.json();

  const ticket = await SupportTicket.findById(id);
  if (!ticket) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });

  if (body.status && VALID_STATUS.includes(body.status)) ticket.status = body.status;
  if (body.priority && ["low", "normal", "high"].includes(body.priority)) ticket.priority = body.priority;

  const reply = trimString(body.reply);
  if (reply) ticket.responses.push({ author: "admin", message: reply, createdAt: new Date() });

  await ticket.save();
  await logActivity("update", "ticket", session.user?.email, { id, status: ticket.status });
  return NextResponse.json(ticket);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  await SupportTicket.findByIdAndDelete(id);
  await logActivity("delete", "ticket", session.user?.email, { id });
  return NextResponse.json({ success: true });
}
