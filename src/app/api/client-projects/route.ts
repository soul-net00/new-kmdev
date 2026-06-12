import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClientProject } from "@/models/ClientProject";
import { Client } from "@/models/Client";
import { requireAdmin, unauthorizedResponse, badRequestResponse } from "@/lib/admin";
import { trimString, clampNumber } from "@/lib/validation";
import { logActivity } from "@/lib/activity";
import { DEFAULT_HANDOVER, getAgencySettings } from "@/lib/agency";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const query = clientId ? { clientId } : {};
  const projects = await ClientProject.find(query).sort({ createdAt: -1 }).lean();
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
  const clientId = trimString(body.clientId);
  const projectName = trimString(body.projectName);

  if (!clientId || !projectName) {
    return badRequestResponse("clientId and projectName are required.");
  }

  const client = await Client.findById(clientId).lean();
  if (!client) return NextResponse.json({ error: "Client not found." }, { status: 404 });

  const settings = await getAgencySettings();
  const projectValue = clampNumber(body.projectValue, 0, 100000000);

  // Seed pricing extras from configured options (disabled until selected).
  const extras = (settings.pricingOptions || []).map((o) => ({
    key: o.key,
    label: o.label,
    amount: o.amount,
    recurring: o.recurring,
    enabled: false
  }));

  // Seed standard payment milestones.
  const payments = [
    { label: "Deposit", amount: 0, paid: false },
    { label: "Milestone Payment", amount: 0, paid: false },
    { label: "Final Payment", amount: 0, paid: false }
  ];

  const project = await ClientProject.create({
    clientId,
    projectName,
    description: trimString(body.description),
    category: trimString(body.category) || "Web",
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    expectedCompletion: body.expectedCompletion ? new Date(body.expectedCompletion) : undefined,
    projectValue,
    notes: trimString(body.notes),
    status: "Consultation",
    basePrice: projectValue,
    extras,
    payments,
    handover: DEFAULT_HANDOVER
  });

  await logActivity("create", "client-project", session.user?.email, { clientId, projectName });
  return NextResponse.json(project, { status: 201 });
}
