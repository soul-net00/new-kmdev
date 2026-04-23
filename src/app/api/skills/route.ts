import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Skill } from "@/models/Skill";
import { ensureSeedData } from "@/lib/data";
import { badRequestResponse, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

export async function GET() {
  await ensureSeedData();
  const skills = await Skill.find().sort({ group: 1, createdAt: -1 }).lean();
  return NextResponse.json(skills);
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
  if (!body.name) return badRequestResponse("Skill name is required.");
  const skill = await Skill.create(body);
  await logActivity("create", "skill", session.user?.email, { name: skill.name });
  return NextResponse.json(skill, { status: 201 });
}
