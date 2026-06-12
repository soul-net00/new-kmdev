import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClientDocument } from "@/models/ClientDocument";

/**
 * PUBLIC route — verifies a document by its reference number.
 * Returns only non-sensitive authenticity fields.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const referenceNumber = decodeURIComponent(ref || "").trim().toUpperCase();

  if (!referenceNumber) {
    return NextResponse.json({ valid: false, error: "No reference number provided." }, { status: 400 });
  }

  await connectToDatabase();
  const doc = await ClientDocument.findOne({ referenceNumber }).lean();

  if (!doc) {
    return NextResponse.json({ valid: false, referenceNumber });
  }

  const snapshot: any = doc.snapshot || {};
  const paid = snapshot.payments?.paid || 0;
  const total = snapshot.payments?.total || 0;
  let paymentStatus = "No payments tracked";
  if (total > 0) {
    if (paid >= total) paymentStatus = "Fully paid";
    else if (paid > 0) paymentStatus = "Partially paid";
    else paymentStatus = "Outstanding";
  }

  return NextResponse.json({
    valid: true,
    referenceNumber: doc.referenceNumber,
    documentTitle: doc.title,
    clientName: snapshot.client?.clientName || "",
    companyName: snapshot.client?.companyName || "",
    projectName: snapshot.project?.projectName || "",
    generatedAt: doc.generatedAt,
    status: doc.status,
    approved: doc.status === "approved",
    approvedAt: doc.approvedAt || null,
    signed: Boolean(doc.signature && doc.signature.signedAt),
    signedBy: doc.signature?.signedBy || "",
    signedAt: doc.signature?.signedAt || null,
    paymentStatus
  });
}
