import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Skill } from "@/models/Skill";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const skill = await Skill.findById(id).lean();
  return NextResponse.json(skill);
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
  const skill = await Skill.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  await logActivity("update", "skill", session.user?.email, { id, name: skill?.name });
  return NextResponse.json(skill);
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
  const skill = await Skill.findByIdAndDelete(id);
  await logActivity("delete", "skill", session.user?.email, { id, name: skill?.name });
  return NextResponse.json({ success: true });
}
