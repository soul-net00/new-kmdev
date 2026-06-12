export type OrderStatus = "pending" | "accepted" | "declined" | "completed";

export interface HeroContent {
  title: string;
  subtitle: string;
  intro: string;
  image: string;
  stats: Array<{ label: string; value: string }>;
  cta: Array<{ label: string; href: string }>;
}

export interface AboutContent {
  text: string;
  image: string;
  highlights: string[];
}

export interface SiteSettings {
  _id?: string;
  brandName: string;
  hero: HeroContent;
  about: AboutContent;
  contact: {
    email: string;
    whatsapp: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectType {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  category: "Web" | "Desktop" | "Database" | "Other";
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  highlights?: string[];
  createdAt?: string;
}

export interface SkillType {
  _id?: string;
  name: string;
  percentage: number;
  group: "Frontend" | "Backend" | "Database" | "Networking" | "Tools" | "Web Development" | "Data & Systems" | "System & Hardware" | "Analysis";
}

export interface TechTagType {
  label: string;
  icon?: string;
}

export interface ServiceType {
  _id?: string;
  name: string;
  description: string;
  priceFrom: number;
  image?: string;
  active: boolean;
  includes?: string[];
  createdAt?: string;
}

export interface OrderType {
  _id?: string;
  customerName: string;
  email: string;
  serviceId?: string;
  serviceName: string;
  notes?: string;
  amount: number;
  status: OrderStatus;
  createdAt?: string;
}

export interface ReceiptType {
  _id?: string;
  orderId?: string;
  receiptNumber: string;
  customerName: string;
  serviceName: string;
  amount: number;
  issuedAt?: string;
  pdfUrl?: string;
  html?: string;
}


// ─────────────────────────────────────────────────────────────
// Client Management & Project Workflow platform
// ─────────────────────────────────────────────────────────────

export type WorkflowStage =
  | "Consultation"
  | "Quote"
  | "Contract"
  | "Deposit Payment"
  | "Requirements Gathering"
  | "Prototype / Demo"
  | "Client Review & Feedback"
  | "Approval Sign-Off"
  | "Milestone Payment"
  | "Full Development"
  | "Testing"
  | "User Acceptance Testing"
  | "Final Payment"
  | "Project Handover"
  | "Maintenance & Support";

export type DocumentStatus = "draft" | "sent" | "viewed" | "signed" | "approved" | "rejected";

export type DocumentType =
  | "quotation"
  | "contract"
  | "requirements"
  | "review"
  | "approval"
  | "milestone-invoice"
  | "invoice"
  | "final-invoice"
  | "handover-certificate"
  | "maintenance-agreement";

export interface ClientType {
  _id?: string;
  clientName: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingExtra {
  key: string;
  label: string;
  amount: number;
  recurring: boolean;
  enabled: boolean;
}

export interface PaymentEntry {
  _id?: string;
  label: string;
  amount: number;
  paid: boolean;
  paidAt?: string;
  method?: string;
  reference?: string;
}

export interface HandoverItem {
  key: string;
  label: string;
  done: boolean;
}

export interface ClientProjectType {
  _id?: string;
  clientId: string;
  projectName: string;
  description?: string;
  category?: string;
  startDate?: string;
  expectedCompletion?: string;
  projectValue: number;
  notes?: string;
  status: WorkflowStage | string;
  basePrice: number;
  extras: PricingExtra[];
  payments: PaymentEntry[];
  handover: HandoverItem[];
  handoverComplete?: boolean;
  portalEnabled?: boolean;
  portalPasswordHash?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignatureData {
  method: "draw" | "type" | "upload";
  data: string;
  signedBy?: string;
  signedAt?: string;
}

export interface ClientDocumentType {
  _id?: string;
  referenceNumber: string;
  clientId: string;
  projectId: string;
  type: DocumentType | string;
  title: string;
  snapshot?: Record<string, any>;
  status: DocumentStatus;
  signature?: SignatureData | null;
  approvedAt?: string;
  aiGenerated?: boolean;
  generatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketResponse {
  _id?: string;
  author: "admin" | "client";
  message: string;
  createdAt?: string;
}

export interface SupportTicketType {
  _id?: string;
  clientId: string;
  projectId?: string;
  subject: string;
  message: string;
  priority: "low" | "normal" | "high";
  status: "open" | "in-progress" | "resolved" | "closed";
  attachments: string[];
  responses: TicketResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingOption {
  key: string;
  label: string;
  amount: number;
  recurring: boolean;
  description?: string;
  enabled: boolean;
}

export interface ContractClause {
  key: string;
  title: string;
  body: string;
}

export interface AgencySettingsType {
  _id?: string;
  companyName: string;
  developerName: string;
  domain?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  referencePrefix: string;
  pricingOptions: PricingOption[];
  clauses: ContractClause[];
  requireSignature: boolean;
  aiGeminiEnabled?: boolean;
  aiGrokEnabled?: boolean;
  aiPromptExtra?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteRequestType {
  _id?: string;
  contact: { name: string; email: string; phone?: string; company?: string };
  projectType?: string;
  summary?: string;
  estimateText?: string;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  sessionId?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  clientId?: string;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}
