import { About } from "@/components/portfolio/About";
import { Contact } from "@/components/portfolio/Contact";
import { Hero } from "@/components/portfolio/Hero";
import { Projects } from "@/components/portfolio/Projects";
import { QRShare } from "@/components/portfolio/QRShare";
import { ServicesPreview } from "@/components/portfolio/ServicesPreview";
import { Skills } from "@/components/portfolio/Skills";
import { getProjects, getServices, getSiteSettings, getSkills } from "@/lib/data";

export default async function HomePage() {
  const [settings, projects, skills, services] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getSkills(),
    getServices(true)
  ]);

  return (
    <>
      <Hero hero={settings.hero} />
      <About about={settings.about} />
      <Projects projects={projects as any} />
      <Skills skills={skills as any} />
      <ServicesPreview services={services as any} />
      <Contact settings={settings as any} />
      <QRShare />
    </>
  );
}
