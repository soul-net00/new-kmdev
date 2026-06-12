import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClientDocument } from "@/models/ClientDocument";
import { ClientProject } from "@/models/ClientProject";
import { Client } from "@/models/Client";
import { requireAdmin, unauthorizedResponse, badRequestResponse } from "@/lib/admin";
import { trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";
import {
  DOCUMENT_TYPES,
  buildDocumentSnapshot,
  generateReferenceNumber,
  getAgencySettings
} from "@/lib/agency";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const clientId = searchParams.get("clientId");
  const filter: Record<string, unknown> = {};
  if (projectId) filter.projectId = projectId;
  if (clientId) filter.clientId = clientId;

  const documents = await ClientDocument.find(filter).sort({ generatedAt: -1 }).lean();
  return NextResponse.json(documents);
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
  const projectId = trimString(body.projectId);
  const type = trimString(body.type);

  if (!projectId || !type) return badRequestResponse("projectId and type are required.");

  const docMeta = DOCUMENT_TYPES.find((d) => d.key === type);
  if (!docMeta) return badRequestResponse("Unknown document type.");

  const project = await ClientProject.findById(projectId).lean();
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const client = await Client.findById(project.clientId).lean();
  if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

  const settings = await getAgencySettings();
  const snapshot = buildDocumentSnapshot({ type, settings, client, project });
  const referenceNumber = await generateReferenceNumber(settings.referencePrefix || "KMDEV");

  const doc = await ClientDocument.create({
    referenceNumber,
    clientId: project.clientId,
    projectId,
    type,
    title: docMeta.title,
    snapshot,
    status: "draft",
    generatedAt: new Date()
  });

  await logActivity("create", "document", session.user?.email, { referenceNumber, type });
  return NextResponse.json(doc, { status: 201 });
}
