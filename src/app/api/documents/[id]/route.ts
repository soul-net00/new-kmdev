import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClientDocument } from "@/models/ClientDocument";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

const VALID_STATUS = ["draft", "sent", "viewed", "signed", "approved", "rejected"];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const doc = await ClientDocument.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  return NextResponse.json(doc);
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

  if (body.status && VALID_STATUS.includes(body.status)) {
    update.status = body.status;
    if (body.status === "approved") update.approvedAt = new Date();
  }

  // Apply a signature (admin-side capture on behalf of client).
  if (body.signature) {
    const method = trimString(body.signature.method);
    if (["draw", "type", "upload"].includes(method)) {
      update.signature = {
        method,
        data: String(body.signature.data || ""),
        signedBy: trimString(body.signature.signedBy),
        signedAt: new Date()
      };
      update.status = "signed";
    }
  }

  const doc = await ClientDocument.findByIdAndUpdate(id, update, { new: true });
  if (!doc) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  await logActivity("update", "document", session.user?.email, { id, status: doc.status });
  return NextResponse.json(doc);
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
  await ClientDocument.findByIdAndDelete(id);
  await logActivity("delete", "document", session.user?.email, { id });
  return NextResponse.json({ success: true });
}
