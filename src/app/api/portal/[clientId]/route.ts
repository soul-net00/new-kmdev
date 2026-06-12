import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { ClientProject } from "@/models/ClientProject";
import { ClientDocument } from "@/models/ClientDocument";
import { SupportTicket } from "@/models/SupportTicket";
import { trimString } from "@/lib/validation";

/**
 * PUBLIC client portal API. Access is gated by the per-project portal
 * password set by the admin. The password is supplied with every request.
 */

async function authorizeProjects(clientId: string, password: string) {
  const projects = await ClientProject.find({ clientId, portalEnabled: true }).lean();
  const accessible: any[] = [];
  for (const p of projects as any[]) {
    if (!p.portalPasswordHash) {
      accessible.push(p); // no password required
    } else if (password && (await bcryptjs.compare(password, p.portalPasswordHash))) {
      accessible.push(p);
    }
  }
  return accessible;
}

function sanitizeProject(p: any) {
  const { portalPasswordHash, ...rest } = p;
  return rest;
}

export async function POST(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  await connectToDatabase();

  const client = await Client.findById(clientId).lean();
  if (!client) return NextResponse.json({ error: "Portal not found." }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const action = trimString(body.action) || "unlock";
  const password = String(body.password || "");

  const accessible = await authorizeProjects(clientId, password);
  if (accessible.length === 0) {
    return NextResponse.json({ error: "Incorrect password or no accessible projects." }, { status: 401 });
  }
  const accessibleIds = accessible.map((p) => String(p._id));

  // ── Sign a document ──────────────────────────────────────
  if (action === "sign") {
    const documentId = trimString(body.documentId);
    const doc = await ClientDocument.findById(documentId);
    if (!doc || !accessibleIds.includes(String(doc.projectId))) {
      return NextResponse.json({ error: "Document not accessible." }, { status: 403 });
    }
    const method = trimString(body.signature?.method);
    if (!["draw", "type", "upload"].includes(method)) {
      return NextResponse.json({ error: "Invalid signature method." }, { status: 400 });
    }
    doc.signature = {
      method,
      data: String(body.signature?.data || ""),
      signedBy: trimString(body.signature?.signedBy) || (client as any).clientName,
      signedAt: new Date()
    };
    doc.status = "signed";
    await doc.save();
    return NextResponse.json({ success: true, document: doc });
  }

  // ── Approve a document ───────────────────────────────────
  if (action === "approve") {
    const documentId = trimString(body.documentId);
    const doc = await ClientDocument.findById(documentId);
    if (!doc || !accessibleIds.includes(String(doc.projectId))) {
      return NextResponse.json({ error: "Document not accessible." }, { status: 403 });
    }
    doc.status = "approved";
    doc.approvedAt = new Date();
    await doc.save();
    return NextResponse.json({ success: true, document: doc });
  }

  // ── Submit a support ticket ──────────────────────────────
  if (action === "ticket") {
    const subject = trimString(body.subject);
    const message = trimString(body.message);
    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
    }
    const projectId = accessibleIds.includes(trimString(body.projectId)) ? trimString(body.projectId) : accessibleIds[0];
    const ticket = await SupportTicket.create({
      clientId,
      projectId,
      subject,
      message,
      priority: ["low", "normal", "high"].includes(body.priority) ? body.priority : "normal",
      attachments: Array.isArray(body.attachments) ? body.attachments.map((a: any) => String(a)) : []
    });
    return NextResponse.json({ success: true, ticket }, { status: 201 });
  }

  // ── Reply to a ticket ────────────────────────────────────
  if (action === "ticket-reply") {
    const ticketId = trimString(body.ticketId);
    const message = trimString(body.message);
    if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket || String(ticket.clientId) !== String(clientId)) {
      return NextResponse.json({ error: "Ticket not accessible." }, { status: 403 });
    }
    ticket.responses.push({ author: "client", message, createdAt: new Date() });
    if (ticket.status === "resolved" || ticket.status === "closed") ticket.status = "open";
    await ticket.save();
    return NextResponse.json({ success: true, ticket });
  }

  // ── Default: unlock & return portal data ─────────────────
  const [documents, tickets] = await Promise.all([
    ClientDocument.find({ projectId: { $in: accessibleIds } }).sort({ generatedAt: -1 }).lean(),
    SupportTicket.find({ clientId }).sort({ createdAt: -1 }).lean()
  ]);

  return NextResponse.json({
    client: { clientName: (client as any).clientName, companyName: (client as any).companyName, email: (client as any).email },
    projects: accessible.map(sanitizeProject),
    documents,
    tickets
  });
}
