import { clsx } from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function currency(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date?: string | Date) {
  const value = date ? new Date(date) : new Date();
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium"
  }).format(value);
}

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
