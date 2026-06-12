import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { QuoteRequest } from "@/models/QuoteRequest";
import { Client } from "@/models/Client";
import { ClientProject } from "@/models/ClientProject";
import { ClientDocument } from "@/models/ClientDocument";
import { parseIdFromParams, requireAdmin, unauthorizedResponse, badRequestResponse } from "@/lib/admin";
import { trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";
import { DEFAULT_HANDOVER, buildDocumentSnapshot, generateReferenceNumber, getAgencySettings } from "@/lib/agency";

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
  const action = trimString(body.action);

  const qr = await QuoteRequest.findById(id);
  if (!qr) return NextResponse.json({ error: "Quote request not found." }, { status: 404 });

  // ── Modify (edit notes / summary / estimate before deciding) ──
  if (action === "modify") {
    if (body.adminNotes !== undefined) qr.adminNotes = trimString(body.adminNotes);
    if (body.summary !== undefined) qr.summary = trimString(body.summary);
    if (body.estimateText !== undefined) qr.estimateText = trimString(body.estimateText);
    await qr.save();
    await logActivity("update", "quote-request", session.user?.email, { id });
    return NextResponse.json(qr);
  }

  // ── Reject ──
  if (action === "reject") {
    qr.status = "rejected";
    if (body.adminNotes !== undefined) qr.adminNotes = trimString(body.adminNotes);
    await qr.save();
    await logActivity("update", "quote-request", session.user?.email, { id, status: "rejected" });
    return NextResponse.json(qr);
  }

  // ── Approve: convert into CRM Client + Project + AI-draft quotation ──
  if (action === "approve") {
    if (qr.status === "approved" && qr.clientId) {
      return NextResponse.json(qr); // idempotent
    }

    const settings = await getAgencySettings();

    const client = await Client.create({
      clientName: qr.contact.name,
      companyName: qr.contact.company || "",
      email: qr.contact.email,
      phone: qr.contact.phone || "",
      notes: "Created from AI quote request."
    });

    const extras = (settings.pricingOptions || []).map((o) => ({
      key: o.key, label: o.label, amount: o.amount, recurring: o.recurring, enabled: false
    }));

    const project = await ClientProject.create({
      clientId: client._id,
      projectName: qr.projectType || qr.summary?.slice(0, 60) || "New Project",
      description: qr.summary || "",
      category: "Web",
      status: "Consultation",
      basePrice: 0,
      extras,
      payments: [
        { label: "Deposit", amount: 0, paid: false },
        { label: "Milestone Payment", amount: 0, paid: false },
        { label: "Final Payment", amount: 0, paid: false }
      ],
      handover: DEFAULT_HANDOVER,
      notes: [qr.summary, qr.estimateText, qr.adminNotes].filter(Boolean).join("\n\n")
    });

    // Auto-generate an AI-draft quotation document (pending developer approval).
    const snapshot = buildDocumentSnapshot({ type: "quotation", settings, client, project });
    const referenceNumber = await generateReferenceNumber(settings.referencePrefix || "KMDEV");
    const doc = await ClientDocument.create({
      referenceNumber,
      clientId: client._id,
      projectId: project._id,
      type: "quotation",
      title: "Quotation",
      snapshot: { ...snapshot, aiEstimateText: qr.estimateText || "" },
      status: "draft",
      aiGenerated: true,
      generatedAt: new Date()
    });

    qr.status = "approved";
    qr.clientId = client._id;
    qr.projectId = project._id;
    await qr.save();

    await logActivity("approve", "quote-request", session.user?.email, { id, clientId: String(client._id), referenceNumber });
    return NextResponse.json({ quoteRequest: qr, clientId: client._id, projectId: project._id, referenceNumber, documentId: doc._id });
  }

  return badRequestResponse("Unknown action. Use approve, modify, or reject.");
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
  await QuoteRequest.findByIdAndDelete(id);
  await logActivity("delete", "quote-request", session.user?.email, { id });
  return NextResponse.json({ success: true });
}
