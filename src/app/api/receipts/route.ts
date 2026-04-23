import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Receipt } from "@/models/Receipt";
import { requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

function buildReceiptHtml(receipt: {
  receiptNumber: string;
  customerName: string;
  serviceName: string;
  amount: number;
  issuedAt: Date;
}) {
  const date = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(receipt.issuedAt);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${receipt.receiptNumber}</title>
<style>
body{font-family:Arial,sans-serif;background:#f8fafc;color:#0f172a;padding:32px}
.sheet{max-width:760px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:32px;position:relative;overflow:hidden}
.watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:84px;font-weight:800;color:rgba(15,23,42,.05);transform:rotate(-28deg);pointer-events:none}
.brand{font-size:28px;font-weight:800;margin-bottom:8px}.muted{color:#64748b;font-size:14px}
.row{display:flex;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid #e2e8f0}
.total{font-size:24px;font-weight:800;color:#16a34a}.label{font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#64748b}.value{font-size:16px;font-weight:700}
</style>
</head>
<body>
  <div class="sheet">
    <div class="watermark">KMDev</div>
    <div class="brand">KMDev Receipt</div>
    <div class="muted">Professional IT and digital service receipt</div>
    <div class="row"><div><div class="label">Receipt Number</div><div class="value">${receipt.receiptNumber}</div></div><div><div class="label">Issued</div><div class="value">${date}</div></div></div>
    <div class="row"><div><div class="label">Customer</div><div class="value">${receipt.customerName}</div></div></div>
    <div class="row"><div><div class="label">Service</div><div class="value">${receipt.serviceName}</div></div></div>
    <div class="row"><div><div class="label">Amount</div><div class="total">R ${receipt.amount.toLocaleString("en-ZA")}</div></div></div>
  </div>
</body>
</html>`;
}

function makeReceiptNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(100 + Math.random() * 900);
  return `KM-${stamp}-${rand}`;
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const receipts = await Receipt.find().sort({ issuedAt: -1 }).lean();
  return NextResponse.json(receipts);
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
  const orderId = String(body.orderId || "").trim();

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required." }, { status: 400 });
  }

  const existing = await Receipt.findOne({ orderId }).lean();
  if (existing) {
    return NextResponse.json(existing, { status: 200 });
  }

  const order = await Order.findById(orderId).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const issuedAt = new Date();
  const receiptNumber = makeReceiptNumber();
  const html = buildReceiptHtml({
    receiptNumber,
    customerName: order.customerName,
    serviceName: order.serviceName,
    amount: Number(order.amount || 0),
    issuedAt
  });

  const receipt = await Receipt.create({
    orderId,
    receiptNumber,
    customerName: order.customerName,
    serviceName: order.serviceName,
    amount: Number(order.amount || 0),
    issuedAt,
    html
  });

  await Order.findByIdAndUpdate(orderId, { status: "completed" });
  await logActivity("create", "receipt", session.user?.email, { orderId, receiptNumber });

  return NextResponse.json(receipt, { status: 201 });
}
