import { connectToDatabase } from "@/lib/mongodb";
import { defaultSiteSettings } from "@/lib/default-data";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { SiteSettings } from "@/models/SiteSettings";
import { Skill } from "@/models/Skill";
import { Order } from "@/models/Order";
import { Receipt } from "@/models/Receipt";
import { ActivityLog } from "@/models/ActivityLog";
import type { SiteSettings as SiteSettingsType } from "@/types";

function toPlain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function ensureSeedData() {
  try {
    await connectToDatabase();
  } catch {
    throw new Error("Cannot connect to database");
  }
}

export async function getSiteSettings(): Promise<SiteSettingsType> {
  try {
    await ensureSeedData();
    const settings = await SiteSettings.findOne().lean();
    if (settings) return settings as any;
    return defaultSiteSettings as any;
  } catch (error) {
    console.error("Database error:", error);
    return defaultSiteSettings as any;
  }
}

export async function getProjects() {
  try {
    await ensureSeedData();
    return toPlain(await Project.find().sort({ createdAt: -1 }).lean());
  } catch {
    return [];
  }
}

export async function getSkills() {
  try {
    await ensureSeedData();
    return toPlain(await Skill.find().sort({ group: 1, createdAt: -1 }).lean());
  } catch {
    return [];
  }
}

export async function getServices(activeOnly = false) {
  try {
    await ensureSeedData();
    return toPlain(await Service.find(activeOnly ? { active: true } : {}).sort({ createdAt: -1 }).lean());
  } catch {
    return [];
  }
}

export async function getAdminCounts() {
  try {
    await ensureSeedData();
    const [projects, services, orders, receipts, pendingOrders, activities] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Order.countDocuments(),
      Receipt.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      ActivityLog.countDocuments()
    ]);

    return { projects, services, orders, receipts, pendingOrders, activities };
  } catch {
    return { projects: 0, services: 0, orders: 0, receipts: 0, pendingOrders: 0, activities: 0 };
  }
}