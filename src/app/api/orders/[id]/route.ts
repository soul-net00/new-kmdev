import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { parseIdFromParams, requireAdmin, unauthorizedResponse } from "@/lib/admin";
import { logActivity } from "@/lib/activity";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const id = await parseIdFromParams(params);
  const body = await request.json();
  const update: Record<string, unknown> = {};

  if (body.status) update.status = body.status;
  if (body.notes !== undefined) update.notes = String(body.notes || "").trim();

  const order = await Order.findByIdAndUpdate(id, update, { new: true, runValidators: true });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  await logActivity("update", "order", session.user?.email, { id, status: order.status });
  return NextResponse.json(order);
}
