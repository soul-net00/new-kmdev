import { whatsappLink } from "@/lib/utils";
import type { SiteSettings } from "@/types";

export function Contact({ settings }: { settings: SiteSettings }) {
  const contact = settings.contact || { email: "", whatsapp: "" };
  const email = contact.email || "kgomotsothabo2004@gmail.com";
  const whatsapp = contact.whatsapp || "0601603996";

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:rounded-3xl md:p-8 md:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600">Contact</p>
          <h2 className="text-xl font-bold md:text-3xl">Let's build something useful.</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 md:mt-4">Available for freelance work, internships, websites, IT support, and networking help.</p>
        </div>
        <div className="space-y-3 text-sm">
          <a href={`mailto:${email}`} className="block rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
            ✉️ <span className="ml-2">{email}</span>
          </a>
          <a href={whatsappLink(whatsapp, "Hi KMDev, I would like to discuss a project.")} target="_blank" className="block rounded-xl bg-[#25D366] px-3.5 py-3.5 font-semibold text-white text-center">
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
