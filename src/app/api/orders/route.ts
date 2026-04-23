import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { isValidEmail, trimString, clampNumber } from "@/lib/validation";
import { logActivity } from "@/lib/activity";

const rateLimitStore = new Map<string, number[]>();

function isRateLimited(key: string, limit = 5, windowMs = 5 * 60 * 1000) {
  const now = Date.now();
  const list = (rateLimitStore.get(key) || []).filter((stamp) => now - stamp < windowMs);
  list.push(now);
  rateLimitStore.set(key, list);
  return list.length > limit;
}

function normalizeOrderBody(body: any) {
  return {
    customerName: trimString(body.customerName),
    email: trimString(body.email),
    serviceId: body.serviceId ? String(body.serviceId) : undefined,
    serviceName: trimString(body.serviceName),
    notes: trimString(body.notes),
    amount: clampNumber(body.amount, 0, 1000000),
    status: body.status || "pending"
  };
}

export async function GET() {
  await connectToDatabase();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }

  const body = normalizeOrderBody(await request.json());

  if (!body.customerName || !body.email || !body.serviceName) {
    return NextResponse.json({ error: "customerName, email, and serviceName are required." }, { status: 400 });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const order = await Order.create(body);
  await logActivity("create", "order", body.email, { serviceName: body.serviceName, amount: body.amount });
  return NextResponse.json(order, { status: 201 });
}
