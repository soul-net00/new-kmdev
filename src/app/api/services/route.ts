import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { ensureSeedData } from "@/lib/data";
import { badRequestResponse, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

export async function GET() {
  await ensureSeedData();
  const services = await Service.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(services);
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
  if (!body.name || !body.description) return badRequestResponse("Service name and description are required.");
  const service = await Service.create(body);
  await logActivity("create", "service", session.user?.email, { name: service.name });
  return NextResponse.json(service, { status: 201 });
}
