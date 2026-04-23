import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { ensureSeedData } from "@/lib/data";
import { badRequestResponse, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

export async function GET() {
  await ensureSeedData();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(projects);
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
  if (!body.title || !body.description) return badRequestResponse("Title and description are required.");

  const project = await Project.create(body);
  await logActivity("create", "project", session.user?.email, { title: project.title });
  return NextResponse.json(project, { status: 201 });
}
