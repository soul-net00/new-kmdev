import { ServicesCatalog } from "@/components/services/ServicesCatalog";
import { getServices, getSiteSettings } from "@/lib/data";

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(true), getSiteSettings()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-16">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-emerald-600 sm:text-sm">Services</p>
        <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl">Work with KMDev</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Choose a service, request it directly into the admin system, or continue on WhatsApp if you want a faster reply.
        </p>
      </div>
      <ServicesCatalog services={services as any} whatsapp={(settings as any).contact.whatsapp} />
    </div>
  );
}