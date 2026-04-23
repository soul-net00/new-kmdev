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
  createdAt?: string;
}

export interface SkillType {
  _id?: string;
  name: string;
  percentage: number;
  group: "Frontend" | "Backend" | "Database" | "Networking" | "Tools";
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
