import { connectToDatabase } from "@/lib/mongodb";
import { Counter } from "@/models/Counter";
import { Client } from "@/models/Client";
import { ClientProject } from "@/models/ClientProject";
import { ClientDocument } from "@/models/ClientDocument";
import { SupportTicket } from "@/models/SupportTicket";
import { AgencySettings } from "@/models/AgencySettings";
import { QuoteRequest } from "@/models/QuoteRequest";
import { WORKFLOW_STAGES, DOCUMENT_TYPES, computePricing, computePayments } from "@/lib/agency-constants";
import type {
  AgencySettingsType,
  DocumentType,
  HandoverItem,
  PricingOption
} from "@/types";

export { WORKFLOW_STAGES, DOCUMENT_TYPES, computePricing, computePayments };

function toPlain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
export const DEFAULT_PRICING_OPTIONS: PricingOption[] = [
  {
    key: "ai-chatbot",
    label: "AI Chatbot Integration",
    amount: 350,
    recurring: false,
    description:
      "AI chatbot functionality requires third-party AI APIs. API usage costs are billed separately according to the provider's pricing.",
    enabled: true
  },
  {
    key: "monthly-maintenance",
    label: "Monthly Maintenance",
    amount: 250,
    recurring: true,
    description:
      "Includes: Monthly Updates, Security Improvements, Bug Fixes, Performance Optimisation, Minor Feature Improvements.",
    enabled: true
  },
  { key: "priority-support", label: "Priority Support", amount: 0, recurring: true, description: "Faster response times and dedicated support.", enabled: true },
  { key: "hosting-setup", label: "Hosting Setup", amount: 0, recurring: false, description: "Provisioning and configuration of hosting.", enabled: true },
  { key: "domain-registration", label: "Domain Registration", amount: 0, recurring: false, description: "Registration of a domain name.", enabled: true },
  { key: "advanced-analytics", label: "Advanced Analytics", amount: 0, recurring: false, description: "Analytics and reporting setup.", enabled: true }
];

// ── Default contract clauses ────────────────────────────────
export const DEFAULT_CLAUSES = [
  {
    key: "ownership",
    title: "Ownership Clause",
    body:
      "Unless otherwise agreed in writing, source code ownership remains with the developer until full payment has been received."
  },
  {
    key: "full-ownership",
    title: "Full Ownership Clause",
    body:
      "If the client wishes to obtain complete ownership rights, source code rights, resale rights, or intellectual property rights, the client must contact the developer for a separate ownership transfer agreement."
  },
  {
    key: "maintenance",
    title: "Maintenance Clause",
    body: "Maintenance subscriptions are optional and billed monthly."
  },
  {
    key: "cancellation",
    title: "Cancellation Clause",
    body: "Clients may cancel maintenance with written notice according to the agreed notice period."
  },
  {
    key: "ai",
    title: "AI Clause",
    body:
      "The AI chatbot feature relies on external AI service providers. The developer is responsible for implementation and integration. The client is responsible for any ongoing API usage costs charged by the AI provider."
  }
];

// ── Default handover checklist ──────────────────────────────
export const DEFAULT_HANDOVER: HandoverItem[] = [
  { key: "source-code", label: "Source Code", done: false },
  { key: "database", label: "Database", done: false },
  { key: "hosting-credentials", label: "Hosting Credentials", done: false },
  { key: "domain-credentials", label: "Domain Credentials", done: false },
  { key: "documentation", label: "Documentation", done: false },
  { key: "admin-access", label: "Admin Access", done: false },
  { key: "assets", label: "Assets", done: false },
  { key: "user-training", label: "User Training", done: false }
];

// ── Reference number generator ──────────────────────────────
/**
 * Generates a unique, sequential reference number of the form
 * KMDEV-2026-00001 using an atomic counter keyed per year.
 */
export async function generateReferenceNumber(prefix = "KMDEV"): Promise<string> {
  await connectToDatabase();
  const year = new Date().getFullYear();
  const key = `doc-${year}`;
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = String(counter.seq).padStart(5, "0");
  return `${prefix}-${year}-${seq}`;
}

// ── Settings ────────────────────────────────────────────────
export async function getAgencySettings(): Promise<AgencySettingsType> {
  await connectToDatabase();
  let settings = await AgencySettings.findOne().lean();
  if (!settings) {
    const created = await AgencySettings.create({
      pricingOptions: DEFAULT_PRICING_OPTIONS,
      clauses: DEFAULT_CLAUSES
    });
    settings = created.toObject();
  }
  const plain = toPlain(settings) as AgencySettingsType;
  if (!plain.pricingOptions || plain.pricingOptions.length === 0) plain.pricingOptions = DEFAULT_PRICING_OPTIONS;
  if (!plain.clauses || plain.clauses.length === 0) plain.clauses = DEFAULT_CLAUSES;
  return plain;
}

// ── Data getters ────────────────────────────────────────────
export async function getClients(search = "") {
  await connectToDatabase();
  const query = search
    ? {
        $or: [
          { clientName: { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    : {};
  return toPlain(await Client.find(query).sort({ createdAt: -1 }).lean());
}

export async function getClient(id: string) {
  await connectToDatabase();
  const client = await Client.findById(id).lean();
  return client ? toPlain(client) : null;
}

export async function getClientProjects(clientId: string) {
  await connectToDatabase();
  return toPlain(await ClientProject.find({ clientId }).sort({ createdAt: -1 }).lean());
}

export async function getProject(id: string) {
  await connectToDatabase();
  const project = await ClientProject.findById(id).lean();
  return project ? toPlain(project) : null;
}

export async function getDocuments(filter: Record<string, unknown> = {}) {
  await connectToDatabase();
  return toPlain(await ClientDocument.find(filter).sort({ generatedAt: -1 }).lean());
}

export async function getTickets(filter: Record<string, unknown> = {}) {
  await connectToDatabase();
  return toPlain(await SupportTicket.find(filter).sort({ createdAt: -1 }).lean());
}

// ── Analytics ───────────────────────────────────────────────
export async function getAgencyCounts() {
  try {
    await connectToDatabase();
    const [clients, projects, documents, tickets, openTickets] = await Promise.all([
      Client.countDocuments({ archived: { $ne: true } }),
      ClientProject.countDocuments(),
      ClientDocument.countDocuments(),
      SupportTicket.countDocuments(),
      SupportTicket.countDocuments({ status: { $in: ["open", "in-progress"] } })
    ]);
    const pendingQuotes = await QuoteRequest.countDocuments({ status: "pending" });

    const allProjects = await ClientProject.find().select("projectValue payments status").lean();
    let pipelineValue = 0;
    let collected = 0;
    const byStage: Record<string, number> = {};
    for (const p of allProjects as any[]) {
      pipelineValue += Number(p.projectValue || 0);
      collected += computePayments(p.payments || []).paid;
      byStage[p.status] = (byStage[p.status] || 0) + 1;
    }

    return {
      clients,
      projects,
      documents,
      tickets,
      openTickets,
      pendingQuotes,
      pipelineValue,
      collected,
      outstanding: Math.max(0, pipelineValue - collected),
      byStage
    };
  } catch {
    return {
      clients: 0, projects: 0, documents: 0, tickets: 0, openTickets: 0, pendingQuotes: 0,
      pipelineValue: 0, collected: 0, outstanding: 0, byStage: {} as Record<string, number>
    };
  }
}

// ── Document builder ────────────────────────────────────────
/**
 * Builds the immutable snapshot stored on a document at generation time.
 * The snapshot contains everything the document template needs to render,
 * so editing the client/project later never alters issued documents.
 */
export function buildDocumentSnapshot(args: {
  type: DocumentType | string;
  settings: AgencySettingsType;
  client: any;
  project: any;
}) {
  const { type, settings, client, project } = args;
  const pricing = computePricing(project);
  const payments = computePayments(project.payments || []);
  const docMeta = DOCUMENT_TYPES.find((d) => d.key === type);

  return {
    type,
    title: docMeta?.title || "Document",
    company: {
      companyName: settings.companyName,
      developerName: settings.developerName,
      domain: settings.domain || "",
      logo: settings.logo || "",
      email: settings.email || "",
      phone: settings.phone || "",
      address: settings.address || ""
    },
    client: {
      clientName: client.clientName,
      companyName: client.companyName || "",
      email: client.email,
      phone: client.phone || "",
      address: client.address || ""
    },
    project: {
      projectName: project.projectName,
      description: project.description || "",
      category: project.category || "",
      startDate: project.startDate || null,
      expectedCompletion: project.expectedCompletion || null,
      projectValue: Number(project.projectValue || 0),
      status: project.status
    },
    pricing: {
      basePrice: pricing.base,
      extras: (project.extras || []).filter((e: any) => e.enabled),
      oneOffExtras: pricing.oneOffExtras,
      monthly: pricing.monthly,
      total: pricing.total
    },
    payments: {
      entries: project.payments || [],
      total: payments.total,
      paid: payments.paid,
      outstanding: payments.outstanding
    },
    handover: project.handover || [],
    clauses: settings.clauses || [],
    requireSignature: settings.requireSignature
  };
}
