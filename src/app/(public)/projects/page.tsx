import type { Metadata } from "next";
import { AllProjects } from "@/components/portfolio/AllProjects";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Projects",
  description: "Browse the full portfolio of projects by Kgomotso Mamogale (KMDev)."
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <AllProjects projects={projects as any} />;
}
