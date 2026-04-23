import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Service } from "@/models/Service";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const service = await Service.findById(id).lean();
  return NextResponse.json(service);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const body = await request.json();
  const service = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  await logActivity("update", "service", session.user?.email, { id, name: service?.name });
  return NextResponse.json(service);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const service = await Service.findByIdAndDelete(id);
  await logActivity("delete", "service", session.user?.email, { id, name: service?.name });
  return NextResponse.json({ success: true });
}
