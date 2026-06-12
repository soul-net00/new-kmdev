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

/**
 * Lock or unlock page scrolling for overlays (modals, mobile menu).
 *
 * The viewport scroll container is <html>, so we must lock the document
 * element (not just <body>) or the background would scroll behind overlays.
 * We also pad for the scrollbar width to prevent a horizontal layout shift
 * when the scrollbar disappears on lock.
 */
export function setScrollLock(locked: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (locked) {
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    root.style.overflow = "";
    root.style.paddingRight = "";
  }
}
