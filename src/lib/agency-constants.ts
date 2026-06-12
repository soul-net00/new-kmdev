import type { DocumentType } from "@/types";

/** Client-safe constants and pure helpers (no DB imports). */

export const WORKFLOW_STAGES = [
  "Consultation",
  "Quote",
  "Contract",
  "Deposit Payment",
  "Requirements Gathering",
  "Prototype / Demo",
  "Client Review & Feedback",
  "Approval Sign-Off",
  "Milestone Payment",
  "Full Development",
  "Testing",
  "User Acceptance Testing",
  "Final Payment",
  "Project Handover",
  "Maintenance & Support"
] as const;

export const DOCUMENT_TYPES: { key: DocumentType; title: string; description: string }[] = [
  { key: "quotation", title: "Quotation", description: "Itemised price quote for the project." },
  { key: "contract", title: "Contract Agreement", description: "Legally styled development agreement." },
  { key: "requirements", title: "Requirements Specification", description: "Agreed scope and requirements." },
  { key: "review", title: "Client Review & Feedback Form", description: "Capture client feedback on a demo." },
  { key: "approval", title: "Approval Sign-Off Form", description: "Client approval and sign-off." },
  { key: "milestone-invoice", title: "Milestone Payment Request", description: "Request a milestone payment." },
  { key: "invoice", title: "Invoice", description: "Standard invoice." },
  { key: "final-invoice", title: "Final Payment Invoice", description: "Final balance invoice." },
  { key: "handover-certificate", title: "Project Handover Certificate", description: "Confirms project handover." },
  { key: "maintenance-agreement", title: "Maintenance Agreement", description: "Ongoing maintenance terms." }
];

export function computePricing(project: { basePrice?: number; extras?: Array<{ amount: number; recurring: boolean; enabled: boolean }> }) {
  const base = Number(project.basePrice || 0);
  const extras = (project.extras || []).filter((e) => e.enabled);
  const oneOff = extras.filter((e) => !e.recurring).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const monthly = extras.filter((e) => e.recurring).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  return { base, oneOffExtras: oneOff, monthly, subtotal: base + oneOff, total: base + oneOff };
}

export function computePayments(payments: { amount: number; paid: boolean }[] = []) {
  const total = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const paid = payments.filter((p) => p.paid).reduce((s, p) => s + Number(p.amount || 0), 0);
  return { total, paid, outstanding: Math.max(0, total - paid) };
}
