"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { currency, formatDate } from "@/lib/utils";
import type { OrderStatus, OrderType, ReceiptType } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    const data = await fetch("/api/orders", { cache: "no-store" }).then((res) => res.json());
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function updateStatus(id: string | undefined, status: OrderStatus) {
    if (!id) return;
    setBusyId(id);
    setNotice(null);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await loadOrders();
    setBusyId(null);
  }

  async function generateReceipt(order: OrderType) {
    if (!order._id) return;
    setBusyId(order._id);
    setNotice(null);

    const response = await fetch("/api/receipts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order._id })
    });

    const receipt: ReceiptType | { error?: string } = await response.json();
    if (!response.ok || "error" in receipt) {
      setNotice((receipt as { error?: string }).error || "Could not generate receipt.");
    } else {
      const r = receipt as ReceiptType;
      setNotice(`Receipt ${r.receiptNumber} generated for ${r.customerName}.`);
    }

    await loadOrders();
    setBusyId(null);
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="text-sm text-slate-500">Manage customer requests, update statuses, and generate receipts when a job is done.</p>
      </div>
      {notice && <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">{notice}</div>}
      {loading ? <p className="text-sm text-slate-500">Loading orders...</p> : orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet.</p> : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{order.customerName}</div>
                  <div className="text-sm text-slate-500">{order.serviceName} · {order.email}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-600">{order.status}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{currency(order.amount)}</div>
                  {order.notes && <p className="mt-2 text-sm text-slate-500">{order.notes}</p>}
                </div>
                <div className="text-right text-sm text-slate-500">{formatDate(order.createdAt)}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" disabled={busyId === order._id} onClick={() => updateStatus(order._id, "accepted")}>Accept</Button>
                <Button variant="secondary" disabled={busyId === order._id} onClick={() => updateStatus(order._id, "declined")}>Decline</Button>
                <Button disabled={busyId === order._id} onClick={() => updateStatus(order._id, "completed")}>Mark completed</Button>
                <Button variant="ghost" className="text-emerald-600" disabled={busyId === order._id} onClick={() => generateReceipt(order)}>Generate receipt</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
