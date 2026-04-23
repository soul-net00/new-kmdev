"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { currency, whatsappLink } from "@/lib/utils";
import type { ServiceType } from "@/types";

interface OrderRequestModalProps {
  open: boolean;
  service: ServiceType | null;
  whatsapp: string;
  onClose: () => void;
}

export function OrderRequestModal({ open, service, whatsapp, onClose }: OrderRequestModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const whatsappHref = useMemo(() => {
    if (!service) return "#";
    const message = `Hi KMDev, I want to order ${service.name} from ${currency(service.priceFrom)}.${notes ? ` Notes: ${notes}` : ""}`;
    return whatsappLink(whatsapp, message);
  }, [notes, service, whatsapp]);

  function resetState() {
    setCustomerName("");
    setEmail("");
    setNotes("");
    setSubmitting(false);
    setSuccess(null);
    setError(null);
  }

  async function submitOrder() {
    if (!service) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          serviceId: service._id,
          serviceName: service.name,
          notes,
          amount: service.priceFrom
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      setSuccess(`Order request sent for ${service.name}. You can now continue on WhatsApp if you want faster confirmation.`);
      setCustomerName("");
      setEmail("");
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        resetState();
      }}
      title={service ? `Request ${service.name}` : "Request service"}
    >
      {service && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="text-sm uppercase tracking-[0.2em] text-emerald-600">Starting from</div>
            <div className="mt-1 text-2xl font-black">{currency(service.priceFrom)}</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600 dark:text-slate-300">Your name</span>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Your full name" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600 dark:text-slate-300">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" placeholder="you@example.com" />
            </label>
          </div>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600 dark:text-slate-300">Notes</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Tell KMDev what you need, deadline, device type, or business goal." />
          </label>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          {success && <p className="text-sm font-medium text-green-600 dark:text-green-400">{success}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={submitOrder} disabled={submitting || !customerName || !email}>
              {submitting ? "Submitting..." : "Save order request"}
            </Button>
            <a href={whatsappHref} target="_blank" className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white">
              Continue on WhatsApp
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
