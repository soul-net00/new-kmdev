import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { QuoteRequest } from "@/models/QuoteRequest";
import { requireAdmin, unauthorizedResponse, badRequestResponse } from "@/lib/admin";
import { isValidEmail, trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

// PUBLIC: the chatbot submits an intake here. Always lands as "pending".
export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json().catch(() => ({}));

  const contact = {
    name: trimString(body?.contact?.name),
    email: trimString(body?.contact?.email),
    phone: trimString(body?.contact?.phone),
    company: trimString(body?.contact?.company)
  };

  if (!contact.name || !contact.email) return badRequestResponse("Name and email are required.");
  if (!isValidEmail(contact.email)) return badRequestResponse("Please provide a valid email address.");

  const transcript = Array.isArray(body.transcript)
    ? body.transcript
        .filter((m: any) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-40)
        .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 4000) }))
    : [];

  const qr = await QuoteRequest.create({
    contact,
    projectType: trimString(body.projectType),
    summary: trimString(body.summary),
    estimateText: trimString(body.estimateText),
    transcript,
    sessionId: trimString(body.sessionId),
    status: "pending"
  });

  await logActivity("create", "quote-request", contact.email, { name: contact.name });
  return NextResponse.json({ success: true, id: qr._id }, { status: 201 });
}

// ADMIN: list quote requests.
export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filter = status ? { status } : {};
  const requests = await QuoteRequest.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(requests);
}
