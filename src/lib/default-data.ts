import type { ProjectType, ServiceType, SiteSettings as SiteSettingsType, SkillType } from "@/types";

export const defaultSiteSettings: Omit<SiteSettingsType, "_id"> = {
  brandName: "KMDev",
  hero: {
    title: "IT Specialist & Web Developer",
    subtitle: "Building smart IT solutions",
    intro: "I specialize in networking, web development, and system analysis to help businesses leverage technology effectively.",
    image: "",
    stats: [
      { label: "Projects", value: "10+" },
      { label: "Services", value: "6" },
      { label: "Clients", value: "3+" }
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
    title: "Smart Receipt System",
    description: "A comprehensive web-based receipt management system with offline and online capabilities, designed for small businesses to manage transactions seamlessly.",
    category: "Web",
    techStack: ["Next.js", "TypeScript", "MongoDB", "PWA"],
    githubUrl: "https://github.com/soul-net00",
    liveUrl: "https://smartreceipt.kmdev.vercel.app",
    featured: true,
    image: "/projects/receipt-system.jpg",
    highlights: [
      "Dual-mode operation: Works offline and syncs when online",
      "Transaction storage with full audit trail",
      "Professional receipt generation with VAT/discount support",
      "Customer records and purchase history tracking",
      "Print-ready receipts optimized for thermal printers",
      "Dashboard with sales analytics and reporting"
    ]
  },
  {
    title: "E-Commerce Business Website",
    description: "A clean, responsive business website with product showcase, contact forms, and order management built for a local client.",
    category: "Web",
    techStack: ["Next.js", "Tailwind CSS", "MongoDB"],
    liveUrl: "https://clientbusiness.co.za",
    featured: true,
    image: "/projects/business-website.jpg",
    highlights: [
      "Responsive design for all devices",
      "Product catalog with categories",
      "Contact and inquiry forms",
      "Admin panel for content management",
      "SEO optimized for local search"
    ]
  },
  {
    title: "Property Listing Platform",
    description: "A modern property listing website with admin controls, dynamic content management, and database integration.",
    category: "Web",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    githubUrl: "https://github.com/soul-net00",
    featured: true,
    image: "/projects/property-listing.jpg",
    highlights: [
      "Property listings with image galleries",
      "Search and filter functionality",
      "Admin dashboard for content management",
      "Responsive mobile-first design",
      "Database-driven dynamic content"
    ]
  },
  {
    title: "Business Admin Dashboard",
    description: "Custom admin dashboard system for managing business operations, inventory, and customer data.",
    category: "Web",
    techStack: ["Next.js", "MongoDB", "TypeScript"],
    featured: false,
    image: "/projects/admin-dashboard.jpg",
    highlights: [
      "Secure admin authentication",
      "CRUD operations for all business data",
      "Real-time analytics dashboard",
      "Exportable reports and data tables"
    ]
  },
  {
    title: "Marketplace System",
    description: "A multi-vendor marketplace platform with approval workflows and moderation features.",
    category: "Web",
    techStack: ["Next.js", "MongoDB", "TypeScript"],
    featured: false,
    image: "/projects/marketplace.jpg",
    highlights: [
      "Vendor registration and approval system",
      "Admin moderation panel",
      "User verification badges",
      "Report and flagging system"
    ]
  },
  {
    title: "BMI Explorer",
    description: "An interactive web application for calculating and tracking Body Mass Index with clean user experience.",
    category: "Web",
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/soul-net00/bmi_explore",
    liveUrl: "https://soul-net00.github.io/bmi_explore/",
    featured: false,
    image: "/projects/bmi-explorer.jpg",
    highlights: [
      "Clean, intuitive interface",
      "Instant BMI calculation",
      "Category classification display",
      "Responsive for all devices"
    ]
  }
];

export const defaultSkills: SkillType[] = [
  // Networking
  { name: "VPN Configuration", percentage: 85, group: "Networking" },
  { name: "Proxy Systems", percentage: 78, group: "Networking" },
  { name: "Network Setup & Troubleshooting", percentage: 82, group: "Networking" },
  { name: "Cisco Packet Tracer", percentage: 75, group: "Networking" },
  { name: "WiFi Optimization", percentage: 80, group: "Networking" },
  
  // Web Development
  { name: "Next.js", percentage: 78, group: "Web Development" },
  { name: "TypeScript", percentage: 75, group: "Web Development" },
  { name: "JavaScript", percentage: 80, group: "Web Development" },
  { name: "Tailwind CSS", percentage: 82, group: "Web Development" },
  { name: "Responsive Design", percentage: 85, group: "Web Development" },
  { name: "API Integration", percentage: 72, group: "Web Development" },
  { name: "PWA Development", percentage: 68, group: "Web Development" },
  
  // Data & Systems
  { name: "MongoDB", percentage: 75, group: "Data & Systems" },
  { name: "SQL & Query Writing", percentage: 70, group: "Data & Systems" },
  { name: "Excel & Data Analysis", percentage: 78, group: "Data & Systems" },
  { name: "Database Design", percentage: 72, group: "Data & Systems" },
  
  // System & Hardware
  { name: "Computer Setup & Assembly", percentage: 85, group: "System & Hardware" },
  { name: "Windows System Configuration", percentage: 88, group: "System & Hardware" },
  { name: "Hardware Troubleshooting", percentage: 82, group: "System & Hardware" },
  { name: "Virus Removal & Security", percentage: 75, group: "System & Hardware" },
  
  // Analysis
  { name: "System Analysis", percentage: 78, group: "Analysis" },
  { name: "Business Process Optimization", percentage: 72, group: "Analysis" },
  { name: "Problem Solving", percentage: 85, group: "Analysis" }
];

export const defaultServices: ServiceType[] = [
  {
    name: "Website Development",
    description: "Modern, responsive websites built with Next.js and Tailwind CSS. Perfect for portfolios, businesses, and landing pages.",
    priceFrom: 800,
    active: true,
    includes: ["Responsive design", "SEO optimization", "Fast loading", "Contact forms", "Mobile-friendly"]
  },
  {
    name: "Web Application Development",
    description: "Custom web applications with database integration, admin panels, and dynamic features. From receipt systems to admin dashboards.",
    priceFrom: 1500,
    active: true,
    includes: ["Database integration", "Admin dashboard", "User authentication", "Data management", "Custom features"]
  },
  {
    name: "Network Setup & Configuration",
    description: "Professional network setup for homes and small businesses. Router configuration, WiFi optimization, and troubleshooting.",
    priceFrom: 400,
    active: true,
    includes: ["Router setup", "WiFi optimization", "Security configuration", "Troubleshooting", "Network diagram"]
  },
  {
    name: "VPN & Proxy Setup",
    description: "Secure VPN and proxy configuration for remote work, privacy, and network security. Corporate and personal solutions.",
    priceFrom: 500,
    active: true,
    includes: ["VPN setup", "Proxy configuration", "Security hardening", "Remote access", "Documentation"]
  },
  {
    name: "System Analysis & Optimization",
    description: "Analyze your business systems, identify weaknesses, and implement technology solutions for improved efficiency.",
    priceFrom: 600,
    active: true,
    includes: ["System audit", "Process mapping", "Improvement plan", "Implementation", "Training support"]
  },
  {
    name: "Computer Setup & Technical Support",
    description: "Complete computer setup, hardware troubleshooting, and technical support. Virus removal, OS installation, and performance optimization.",
    priceFrom: 250,
    active: true,
    includes: ["Hardware diagnostics", "OS installation", "Virus removal", "Performance tuning", "Software setup"]
  }
];