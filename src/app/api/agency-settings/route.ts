import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AgencySettings } from "@/models/AgencySettings";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { trimString } from "@/lib/validation";
import { logActivity } from "@/lib/activity";
import { getAgencySettings } from "@/lib/agency";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }
  const settings = await getAgencySettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  // Ensure a document exists (seeds defaults on first run).
  await getAgencySettings();

  const body = await request.json();
  const update: Record<string, unknown> = {};

  ["companyName", "developerName", "domain", "logo", "email", "phone", "address", "referencePrefix"].forEach((field) => {
    if (body[field] !== undefined) update[field] = trimString(body[field]);
  });
  if (body.requireSignature !== undefined) update.requireSignature = Boolean(body.requireSignature);
  if (body.aiGeminiEnabled !== undefined) update.aiGeminiEnabled = Boolean(body.aiGeminiEnabled);
  if (body.aiGrokEnabled !== undefined) update.aiGrokEnabled = Boolean(body.aiGrokEnabled);
  if (body.aiPromptExtra !== undefined) update.aiPromptExtra = trimString(body.aiPromptExtra);

  if (Array.isArray(body.pricingOptions)) {
    update.pricingOptions = body.pricingOptions.map((o: any) => ({
      key: trimString(o.key),
      label: trimString(o.label),
      amount: Number(o.amount) || 0,
      recurring: Boolean(o.recurring),
      description: trimString(o.description),
      enabled: o.enabled === undefined ? true : Boolean(o.enabled)
    }));
  }

  if (Array.isArray(body.clauses)) {
    update.clauses = body.clauses.map((c: any) => ({
      key: trimString(c.key) || trimString(c.title).toLowerCase().replace(/\s+/g, "-"),
      title: trimString(c.title),
      body: trimString(c.body)
    }));
  }

  const settings = await AgencySettings.findOneAndUpdate({}, update, { new: true, upsert: true });
  await logActivity("update", "agency-settings", session.user?.email, {});
  return NextResponse.json(settings);
}
