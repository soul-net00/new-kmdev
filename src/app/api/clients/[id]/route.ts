import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { ClientProject } from "@/models/ClientProject";
import { ClientDocument } from "@/models/ClientDocument";
import { SupportTicket } from "@/models/SupportTicket";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const client = await Client.findById(id).lean();
  if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

  const [projects, documents, tickets] = await Promise.all([
    ClientProject.find({ clientId: id }).sort({ createdAt: -1 }).lean(),
    ClientDocument.find({ clientId: id }).sort({ generatedAt: -1 }).lean(),
    SupportTicket.find({ clientId: id }).sort({ createdAt: -1 }).lean()
  ]);

  return NextResponse.json({ client, projects, documents, tickets });
}

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
  const update: Record<string, unknown> = {};

  ["clientName", "companyName", "email", "phone", "address", "notes"].forEach((field) => {
    if (body[field] !== undefined) update[field] = trimString(body[field]);
  });
  if (body.archived !== undefined) update.archived = Boolean(body.archived);

  const client = await Client.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

  await logActivity("update", "client", session.user?.email, { id });
  return NextResponse.json(client);
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

  // Cascade delete the client's projects, documents and tickets.
  await Promise.all([
    Client.findByIdAndDelete(id),
    ClientProject.deleteMany({ clientId: id }),
    ClientDocument.deleteMany({ clientId: id }),
    SupportTicket.deleteMany({ clientId: id })
  ]);

  await logActivity("delete", "client", session.user?.email, { id });
  return NextResponse.json({ success: true });
}
