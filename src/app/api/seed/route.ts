import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { Skill } from "@/models/Skill";
import { SiteSettings } from "@/models/SiteSettings";
import { defaultSiteSettings, defaultProjects, defaultSkills, defaultServices } from "@/lib/default-data";

export async function POST() {
  try {
    await connectToDatabase();
    console.log("🌱 Starting database seed...");

    // Seed SiteSettings
    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create(defaultSiteSettings);
      console.log("✅ SiteSettings seeded");
    } else {
      console.log("ℹ️ SiteSettings already exists");
    }

    // Seed Projects
    let projectsAdded = 0;
    for (const project of defaultProjects) {
      const exists = await Project.findOne({ title: project.title });
      if (!exists) {
        await Project.create(project);
        projectsAdded++;
      }
    }
    console.log(`✅ ${projectsAdded} projects added`);

    // Seed Skills
    let skillsAdded = 0;
    for (const skill of defaultSkills) {
      const exists = await Skill.findOne({ name: skill.name });
      if (!exists) {
        await Skill.create(skill);
        skillsAdded++;
      }
    }
    console.log(`✅ ${skillsAdded} skills added`);

    // Seed Services
    let servicesAdded = 0;
    for (const service of defaultServices) {
      const exists = await Service.findOne({ name: service.name });
      if (!exists) {
        await Service.create(service);
        servicesAdded++;
      }
    }
    console.log(`✅ ${servicesAdded} services added`);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      summary: {
        siteSettings: existingSettings ? "skipped" : "created",
        projects: `${projectsAdded} added`,
        skills: `${skillsAdded} added`,
        services: `${servicesAdded} added`
      }
    });
  } catch (error: any) {
    console.error("❌ Seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to seed the database",
    endpoints: {
      seed: "POST /api/seed"
    }
  });
}