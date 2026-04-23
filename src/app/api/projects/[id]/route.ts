import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const project = await Project.findById(id).lean();
  return NextResponse.json(project);
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
  const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  await logActivity("update", "project", session.user?.email, { id, title: project?.title });
  return NextResponse.json(project);
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
  const project = await Project.findByIdAndDelete(id);
  await logActivity("delete", "project", session.user?.email, { id, title: project?.title });
  return NextResponse.json({ success: true });
}
