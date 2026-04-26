import type { ProjectType, ServiceType, SiteSettings as SiteSettingsType, SkillType } from "@/types";

export const defaultSiteSettings: Omit<SiteSettingsType, "_id"> = {
  brandName: "KMDev",
  hero: {
    title: "IT Specialist & Web Developer",
    subtitle: "Networking | Web Development | System Analysis",
    intro: "I specialize in VPNs, proxy systems, network configuration, and modern web applications. I help businesses improve their systems using technology.",
    image: "",
    stats: [
      { label: "Projects", value: "6+" },
      { label: "Services", value: "6" },
      { label: "Clients", value: "3+" }
    ],
    cta: [
      { label: "Services", href: "/services" },
      { label: "Contact", href: "#contact" }
    ]
  },
  about: {
    text: "Hi, I'm KMDev 👋\n\nI'm an IT specialist focused on networking, web development, and system analysis. I work with VPNs, proxy systems, and network configuration, while also building modern web applications.\n\nI have experience with databases, Excel, query development, computer hardware, and system setup—allowing me to analyze and improve business systems effectively.\n\nLet's build something smart 🚀",
    image: "",
    highlights: ["Networking", "Web Development", "System Analysis", "IT Support"]
  },
  contact: {
    email: "kgomotsothabo2004@gmail.com",
    whatsapp: "0601603996"
  }
};

export const defaultProjects: ProjectType[] = [
  {
    title: "Smart Receipt System",
    description: "A receipt management web app built for small businesses to create, store, and manage customer receipts. Supports offline and online use, making it useful even when internet access is unstable.",
    category: "Web",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    githubUrl: "",
    liveUrl: "",
    featured: true,
    image: "",
    highlights: [
      "Create customer receipts",
      "Offline and online functionality",
      "Receipt history and customer records",
      "Printable receipt layout",
      "Payment and item tracking"
    ]
  },
  {
    title: "Product Advertising Website",
    description: "A responsive business website created for a customer to advertise products, display product information, and guide visitors toward making enquiries or purchases.",
    category: "Web",
    techStack: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    liveUrl: "",
    featured: true,
    image: "",
    highlights: [
      "Product showcase section",
      "Mobile-friendly layout",
      "Contact and enquiry options",
      "Clean business-focused design",
      "Easy product presentation"
    ]
  },
  {
    title: "Property Listing Website",
    description: "A modern property listing platform designed to display property details, images, and enquiries. The system includes admin-focused features for managing listings and content.",
    category: "Web",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    githubUrl: "",
    liveUrl: "",
    featured: true,
    image: "",
    highlights: [
      "Property listing cards",
      "Image-based property previews",
      "Admin management structure",
      "Responsive design",
      "Database-ready content structure"
    ]
  },
  {
    title: "Private Admin Dashboard System",
    description: "A private dashboard system built to manage website content, services, records, and admin actions. Details are available on request.",
    category: "Web",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    featured: false,
    image: "",
    highlights: [
      "Protected admin interface",
      "Content management",
      "Service management",
      "Database-connected records",
      "Responsive dashboard layout"
    ]
  },
  {
    title: "Private Marketplace System",
    description: "A private marketplace-style system focused on business listings, approval workflows, and admin moderation. Details are available on request.",
    category: "Web",
    techStack: ["Next.js", "TypeScript", "MongoDB", "API Routes"],
    featured: false,
    image: "",
    highlights: [
      "Business listing structure",
      "Approval and moderation workflow",
      "Report handling concept",
      "Admin control system",
      "Scalable database design"
    ]
  },
  {
    title: "Private Business Tool",
    description: "A custom private business tool designed to support internal workflows, improve organization, and manage business information efficiently. Details are available on request.",
    category: "Web",
    techStack: ["TypeScript", "MongoDB", "Tailwind CSS"],
    featured: false,
    image: "",
    highlights: [
      "Custom workflow support",
      "Business data organization",
      "Admin-focused tools",
      "Database storage",
      "Practical business use case"
    ]
  }
];

export const defaultSkills: SkillType[] = [
  // Networking
  { name: "VPN Configuration", percentage: 85, group: "Networking" },
  { name: "Proxy Systems", percentage: 78, group: "Networking" },
  { name: "Network Setup", percentage: 82, group: "Networking" },
  { name: "Network Troubleshooting", percentage: 80, group: "Networking" },
  { name: "Cisco Packet Tracer", percentage: 75, group: "Networking" },
  { name: "Data Communication", percentage: 72, group: "Networking" },

  // Web Development
  { name: "HTML", percentage: 90, group: "Web Development" },
  { name: "CSS", percentage: 88, group: "Web Development" },
  { name: "JavaScript", percentage: 82, group: "Web Development" },
  { name: "TypeScript", percentage: 78, group: "Web Development" },
  { name: "Next.js", percentage: 75, group: "Web Development" },
  { name: "Tailwind CSS", percentage: 85, group: "Web Development" },
  { name: "Responsive Design", percentage: 88, group: "Web Development" },
  { name: "API Integration", percentage: 72, group: "Web Development" },

  // Data & Databases
  { name: "MongoDB", percentage: 75, group: "Database" },
  { name: "SQL Server Basics", percentage: 70, group: "Database" },
  { name: "Database Design", percentage: 72, group: "Database" },
  { name: "Query Writing", percentage: 68, group: "Database" },
  { name: "Excel Data Handling", percentage: 80, group: "Database" },
  { name: "Data Organization", percentage: 82, group: "Database" },

  // Systems & Hardware
  { name: "Computer Setup", percentage: 88, group: "System & Hardware" },
  { name: "System Configuration", percentage: 85, group: "System & Hardware" },
  { name: "Hardware Troubleshooting", percentage: 82, group: "System & Hardware" },
  { name: "Software Setup", percentage: 85, group: "System & Hardware" },
  { name: "Technical Support", percentage: 88, group: "System & Hardware" },

  // System Analysis
  { name: "System Analysis", percentage: 78, group: "Analysis" },
  { name: "Business Process Analysis", percentage: 75, group: "Analysis" },
  { name: "Identifying Weaknesses", percentage: 80, group: "Analysis" },
  { name: "Business Improvement", percentage: 72, group: "Analysis" },
  { name: "Problem-Solving", percentage: 85, group: "Analysis" }
];

export const defaultServices: ServiceType[] = [
  {
    name: "Website Development",
    description: "Modern, responsive websites for individuals, startups, and small businesses. Helps businesses build a professional online presence.",
    priceFrom: 800,
    active: true,
    image: "",
    includes: [
      "Responsive layout",
      "Clean UI design",
      "Contact/WhatsApp integration",
      "Basic SEO-friendly structure",
      "Mobile-friendly"
    ]
  },
  {
    name: "Web Application Development",
    description: "Custom web systems with dashboards, database integration, and dynamic features. Useful for businesses that need more than a static website.",
    priceFrom: 1500,
    active: true,
    image: "",
    includes: [
      "Admin dashboards",
      "Database connection",
      "Forms and records",
      "Custom business logic",
      "User management"
    ]
  },
  {
    name: "Network Setup & Configuration",
    description: "Network setup and troubleshooting for small environments and practical IT needs. Helps improve connectivity, structure, and reliability.",
    priceFrom: 400,
    active: true,
    image: "",
    includes: [
      "Network planning",
      "Router configuration",
      "Troubleshooting",
      "Connectivity support",
      "Basic documentation"
    ]
  },
  {
    name: "VPN & Proxy Setup",
    description: "Setup and support for VPNs, proxy systems, and secure connection workflows. Helps users connect more securely and manage access better.",
    priceFrom: 500,
    active: true,
    image: "",
    includes: [
      "VPN setup",
      "Proxy configuration",
      "Connection testing",
      "Security guidance",
      "Documentation"
    ]
  },
  {
    name: "System Analysis & Business Optimization",
    description: "Reviewing business systems to identify weaknesses and suggest improvements. Helps businesses improve workflow and use better digital systems.",
    priceFrom: 600,
    active: true,
    image: "",
    includes: [
      "Business process review",
      "Weakness identification",
      "Improvement suggestions",
      "System planning",
      "Implementation guidance"
    ]
  },
  {
    name: "Computer Setup & Technical Support",
    description: "Computer setup, software installation, troubleshooting, and general IT support. Helps users get devices working properly and efficiently.",
    priceFrom: 250,
    active: true,
    image: "",
    includes: [
      "Device setup",
      "Software installation",
      "Troubleshooting",
      "Basic maintenance",
      "Performance optimization"
    ]
  }
];

export async function seedDatabase() {
  const { connectToDatabase } = await import("@/lib/mongodb");
  const { Project } = await import("@/models/Project");
  const { Service } = await import("@/models/Service");
  const { Skill } = await import("@/models/Skill");
  const { SiteSettings } = await import("@/models/SiteSettings");

  try {
    await connectToDatabase();
    console.log("🌱 Starting database seed...");

    // Seed SiteSettings
    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create(defaultSiteSettings);
      console.log("✅ SiteSettings seeded");
    } else {
      console.log("ℹ️ SiteSettings already exists, skipping");
    }

    // Seed Projects
    for (const project of defaultProjects) {
      const exists = await Project.findOne({ title: project.title });
      if (!exists) {
        await Project.create(project);
        console.log(`✅ Project: ${project.title}`);
      }
    }
    console.log("ℹ️ Projects seeded (existing skipped)");

    // Seed Skills
    for (const skill of defaultSkills) {
      const exists = await Skill.findOne({ name: skill.name });
      if (!exists) {
        await Skill.create(skill);
        console.log(`✅ Skill: ${skill.name}`);
      }
    }
    console.log("ℹ️ Skills seeded (existing skipped)");

    // Seed Services
    for (const service of defaultServices) {
      const exists = await Service.findOne({ name: service.name });
      if (!exists) {
        await Service.create(service);
        console.log(`✅ Service: ${service.name}`);
      }
    }
    console.log("ℹ️ Services seeded (existing skipped)");

    console.log("🌱 Database seed complete!");
  } catch (error) {
    console.error("❌ Seed error:", error);
    throw error;
  }
}