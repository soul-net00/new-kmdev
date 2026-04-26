import type { ProjectType, ServiceType, SiteSettings as SiteSettingsType, SkillType } from "@/types";

export const defaultSiteSettings: Omit<SiteSettingsType, "_id"> = {
  brandName: "KMDev",
  hero: {
    title: "Full-stack Developer",
    subtitle: "Building practical IT solutions",
    intro: "I build websites, databases, and admin systems that solve real problems.",
    image: "",
    stats: [
      { label: "Projects", value: "10+" },
      { label: "Services", value: "5" },
      { label: "Years", value: "3+" }
    ],
    cta: [
      { label: "Services", href: "/services" },
      { label: "Contact", href: "#contact" }
    ]
  },
  about: {
    text: "Hi, I'm Kgomotso Mamogale 👋\n\nI'm an IT professional specializing in networking, web development, and system analysis. My expertise spans VPN configurations, proxy systems, and network infrastructure management, complemented by building modern, responsive web applications.\n\nI bring hands-on experience with database design, Excel automation, and SQL query development. Additionally, I offer computer hardware services including diagnostics, assembly, and system setup—enabling me to deliver comprehensive IT solutions for businesses and individuals alike.\n\nLet's build something remarkable together 🚀",
    image: "",
    highlights: ["Web Development", "Database Design", "IT Support", "Networking"]
  },
  contact: {
    email: "kgomotsothabo2004@gmail.com",
    whatsapp: "0601603996"
  }
};

export const defaultProjects: ProjectType[] = [
  {
    title: "MobileFix Manager",
    description: "VB.NET and SQL Server repair shop system with customer records and receipts.",
    category: "Desktop",
    techStack: ["VB.NET", "SQL Server", "Desktop"],
    githubUrl: "https://github.com/soul-net00",
    featured: true
  },
  {
    title: "BMI Explorer",
    description: "Interactive BMI web app with a simple clean user experience.",
    category: "Web",
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/soul-net00/bmi_explore",
    liveUrl: "https://soul-net00.github.io/bmi_explore/",
    featured: true
  },
  {
    title: "CellphoneShopDB",
    description: "Normalized database design for service tracking, receipts, and customer management.",
    category: "Database",
    techStack: ["SQL Server", "Schema Design", "T-SQL"],
    featured: false
  }
];

export const defaultSkills: SkillType[] = [
  { name: "HTML & CSS", percentage: 85, group: "Frontend" },
  { name: "JavaScript / TypeScript", percentage: 72, group: "Frontend" },
  { name: "Next.js", percentage: 68, group: "Backend" },
  { name: "MongoDB", percentage: 65, group: "Database" },
  { name: "SQL Server", percentage: 78, group: "Database" },
  { name: "Cisco Networking", percentage: 75, group: "Networking" },
  { name: "Git & GitHub", percentage: 80, group: "Tools" }
];

export const defaultServices: ServiceType[] = [
  {
    name: "Website Development",
    description: "Modern responsive websites for individuals and small businesses.",
    priceFrom: 500,
    active: true,
    includes: ["Responsive pages", "Fast setup", "Clean UI"]
  },
  {
    name: "Laptop Repair",
    description: "Setup, troubleshooting, clean installs, and performance fixes.",
    priceFrom: 250,
    active: true,
    includes: ["Diagnostics", "OS setup", "Optimization"]
  },
  {
    name: "Database Design",
    description: "Structured systems for business data, receipts, and records.",
    priceFrom: 400,
    active: true,
    includes: ["Tables", "Relations", "Query planning"]
  },
  {
    name: "WiFi & Networking",
    description: "Router setup, WiFi optimization, and troubleshooting for small homes and businesses.",
    priceFrom: 300,
    active: true,
    includes: ["Router setup", "Basic diagnostics", "Security configuration"]
  }
];
