import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { requireAdmin, unauthorizedResponse, badRequestResponse } from "@/lib/admin";
import { isValidEmail, trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

export async function GET(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const search = trimString(searchParams.get("search"));
  const query = search
    ? {
        $or: [
          { clientName: { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    : {};

  const clients = await Client.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const body = await request.json();

  const data = {
    clientName: trimString(body.clientName),
    companyName: trimString(body.companyName),
    email: trimString(body.email),
    phone: trimString(body.phone),
    address: trimString(body.address),
    notes: trimString(body.notes)
  };

  if (!data.clientName || !data.email) {
    return badRequestResponse("Client name and email are required.");
  }
  if (!isValidEmail(data.email)) {
    return badRequestResponse("Please provide a valid email address.");
  }

  const client = await Client.create(data);
  await logActivity("create", "client", session.user?.email, { clientName: data.clientName });
  return NextResponse.json(client, { status: 201 });
}
