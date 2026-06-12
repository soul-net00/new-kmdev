import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { ClientProject } from "@/models/ClientProject";
import { ClientDocument } from "@/models/ClientDocument";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { trimString, clampNumber } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const project = await ClientProject.findById(id).lean();
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  return NextResponse.json(project);
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

  if (body.projectName !== undefined) update.projectName = trimString(body.projectName);
  if (body.description !== undefined) update.description = trimString(body.description);
  if (body.category !== undefined) update.category = trimString(body.category);
  if (body.notes !== undefined) update.notes = trimString(body.notes);
  if (body.status !== undefined) update.status = trimString(body.status);
  if (body.startDate !== undefined) update.startDate = body.startDate ? new Date(body.startDate) : null;
  if (body.expectedCompletion !== undefined) update.expectedCompletion = body.expectedCompletion ? new Date(body.expectedCompletion) : null;
  if (body.projectValue !== undefined) update.projectValue = clampNumber(body.projectValue, 0, 100000000);
  if (body.basePrice !== undefined) update.basePrice = clampNumber(body.basePrice, 0, 100000000);

  // Pricing extras (array of { key, label, amount, recurring, enabled })
  if (Array.isArray(body.extras)) {
    update.extras = body.extras.map((e: any) => ({
      key: trimString(e.key),
      label: trimString(e.label),
      amount: clampNumber(e.amount, 0, 100000000),
      recurring: Boolean(e.recurring),
      enabled: Boolean(e.enabled)
    }));
  }

  // Payment entries
  if (Array.isArray(body.payments)) {
    update.payments = body.payments.map((p: any) => ({
      label: trimString(p.label),
      amount: clampNumber(p.amount, 0, 100000000),
      paid: Boolean(p.paid),
      paidAt: p.paid ? (p.paidAt ? new Date(p.paidAt) : new Date()) : undefined,
      method: trimString(p.method),
      reference: trimString(p.reference)
    }));
  }

  // Handover checklist
  if (Array.isArray(body.handover)) {
    update.handover = body.handover.map((h: any) => ({
      key: trimString(h.key),
      label: trimString(h.label),
      done: Boolean(h.done)
    }));
    update.handoverComplete = body.handover.every((h: any) => h.done);
  }

  if (body.portalEnabled !== undefined) update.portalEnabled = Boolean(body.portalEnabled);

  // Set / clear the per-project portal password.
  if (body.portalPassword !== undefined) {
    const pw = trimString(body.portalPassword);
    update.portalPasswordHash = pw ? await bcryptjs.hash(pw, 10) : "";
  }

  const project = await ClientProject.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  await logActivity("update", "client-project", session.user?.email, { id, status: project.status });
  return NextResponse.json(project);
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
  await Promise.all([
    ClientProject.findByIdAndDelete(id),
    ClientDocument.deleteMany({ projectId: id })
  ]);

  await logActivity("delete", "client-project", session.user?.email, { id });
  return NextResponse.json({ success: true });
}
