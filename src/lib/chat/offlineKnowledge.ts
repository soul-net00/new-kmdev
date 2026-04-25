export interface KnowledgeCategory {
  keywords: string[];
  responses: string[];
  followUpQuestions: string[];
}

export interface OfflineKnowledge {
  greetings: KnowledgeCategory;
  who_are_you: KnowledgeCategory;
  who_is_kgomotso: KnowledgeCategory;
  about_kmdev: KnowledgeCategory;
  education: KnowledgeCategory;
  certificates: KnowledgeCategory;
  skills: KnowledgeCategory;
  web_development: KnowledgeCategory;
  services: KnowledgeCategory;
  website_services: KnowledgeCategory;
  web_app_services: KnowledgeCategory;
  admin_dashboard_services: KnowledgeCategory;
  laptop_repair: KnowledgeCategory;
  it_support: KnowledgeCategory;
  networking: KnowledgeCategory;
  database_services: KnowledgeCategory;
  projects: KnowledgeCategory;
  portfolio_project: KnowledgeCategory;
  marketplace_project: KnowledgeCategory;
  receipt_system_project: KnowledgeCategory;
  property_project: KnowledgeCategory;
  packet_tracer_projects: KnowledgeCategory;
  pricing: KnowledgeCategory;
  contact: KnowledgeCategory;
  whatsapp: KnowledgeCategory;
  email: KnowledgeCategory;
  location: KnowledgeCategory;
  hiring: KnowledgeCategory;
  availability: KnowledgeCategory;
  turnaround_time: KnowledgeCategory;
  technologies: KnowledgeCategory;
  github: KnowledgeCategory;
  vercel: KnowledgeCategory;
  mongodb: KnowledgeCategory;
  nextjs: KnowledgeCategory;
  cisco: KnowledgeCategory;
  cybersecurity: KnowledgeCategory;
  random_unrelated: KnowledgeCategory;
  unknown_default: KnowledgeCategory;
}

export const offlineKnowledge: OfflineKnowledge = {
  greetings: {
    keywords: [
      "hello", "hi", "hey", "good morning", "good afternoon", "good evening",
      "greetings", "what's up", "howdy", "yo", "sup", "hi there"
    ],
    responses: [
      "Hello! Welcome to KMDev. I'm the AI assistant here to help you learn about Kgomotso Mamogale's services and portfolio. What would you like to know?",
      "Hey there! I'm KMDev AI, ready to help you discover services, projects, and how to get in touch. What brings you here today?",
      "Hi! Great to have you here at KMDev. Whether you need a website, IT support, or just want to learn more about our work, I'm here to help!"
    ],
    followUpQuestions: [
      "What services do you offer?",
      "Show me your projects",
      "How can I contact you?"
    ]
  },

  who_are_you: {
    keywords: [
      "who are you", "what are you", "are you a bot", "are you human",
      "kmdev ai", "chatbot", "virtual assistant", "your name"
    ],
    responses: [
      "I'm KMDev AI, the official assistant for Kgomotso Mamogale's portfolio. I help visitors learn about services, projects, skills, and how to get in touch with KMDev.",
      "I'm a virtual assistant for KMDev. My job is to help you discover what Kgomotso can do for you - from websites to IT support.",
      "I'm KMDev AI, here to guide you through Kgomotso's work. Ask me about services, projects, skills, or how to reach out!"
    ],
    followUpQuestions: [
      "Who is Kgomotso?",
      "What does KMDev do?",
      "Show me your services"
    ]
  },

  who_is_kgomotso: {
    keywords: [
      "who is kgomotso", "about kgomotso", "kgomotso mamogale",
      "who is the developer", "about the founder", "tell me about you", "about yourself"
    ],
    responses: [
      "Kgomotso Mamogale is an IT student and web developer based in Gauteng, South Africa. He founded KMDev to offer web development and IT support services.",
      "Kgomotso is an NCV Level 4 IT student at Ekurhuleni East TVET College, specializing in web development, database systems, and IT support. He's the mind behind KMDev.",
      "Kgomotso is a passionate IT professional building websites, admin dashboards, and providing IT support solutions in Gauteng, South Africa. He studies IT while running KMDev."
    ],
    followUpQuestions: [
      "What services do you offer?",
      "What skills does he have?",
      "Show me his projects"
    ]
  },

  about_kmdev: {
    keywords: [
      "what is kmdev", "about kmdev", "kmdev brand", "kmdev business",
      "what do you do", "what is this business", "kmdev services"
    ],
    responses: [
      "KMDev is Kgomotso Mamogale's brand offering web development, IT support, and technology solutions. We help small businesses, students, and individuals get online.",
      "KMDev provides professional yet approachable tech services. From websites to laptop repairs, Kgomotso helps clients with practical IT solutions.",
      "KMDev is a one-person tech operation focused on web development, admin dashboards, and IT support. We believe in real, practical solutions over flashy promises."
    ],
    followUpQuestions: [
      "What services do you offer?",
      "How can I contact you?",
      "Show me your work"
    ]
  },

  education: {
    keywords: [
      "education", "college", "studying", "student", "tvets", "ekurhuleni",
      "ncv", "qualification", "degree", "university", "course"
    ],
    responses: [
      "Kgomotso is currently studying NCV Level 4 IT at Ekurhuleni East TVET College in Gauteng, South Africa. The program covers programming, networking, and IT fundamentals.",
      "Currently an IT student at Ekurhuleni East TVET College, Kgomotso is working toward his NCV qualification while building real-world projects and offering services.",
      "Kgomotso is pursuing an NCV Level 4 IT qualification at Ekurhuleni East TVET College, focusing on web development, databases, and networking skills."
    ],
    followUpQuestions: [
      "What skills did he learn?",
      "Show me his certificates",
      "Is he available for work?"
    ]
  },

  certificates: {
    keywords: [
      "certificate", "certification", "cisco", "get connected",
      "cybersecurity", "qualified", "credentials", "badges"
    ],
    responses: [
      "Kgomotso has earned Cisco Get Connected and Cisco Introduction to Cybersecurity certifications. He's continuing his learning path toward networking and DevNet/CCNA credentials.",
      "Current certifications include Cisco Get Connected and Introduction to Cybersecurity. The learning journey continues with plans for more advanced networking certifications.",
      "Kgomotso holds Cisco certifications and is actively building skills toward advanced credentials in networking, cybersecurity, and development."
    ],
    followUpQuestions: [
      "What skills does he have?",
      "Is he available for hire?",
      "Show me his projects"
    ]
  },

  skills: {
    keywords: [
      "skill", "skills", "can you do", "technologies", "expertise",
      "proficient", "experienced", "knows", "tech stack"
    ],
    responses: [
      "Skills include: HTML, CSS, Tailwind CSS, JavaScript, TypeScript, Next.js, MongoDB, GitHub, and Vercel. IT skills: networking, troubleshooting, laptop repair, and network setup.",
      "Kgomotso works with modern web technologies (React, Next.js, TypeScript, MongoDB) and offers IT support services (hardware, networking, troubleshooting).",
      "Core competencies: Frontend (HTML, CSS, JS, Next.js), Backend (MongoDB), Tools (GitHub, Vercel), and IT Support (laptop repair, network setup, troubleshooting)."
    ],
    followUpQuestions: [
      "Can you build my website?",
      "Do you offer IT support?",
      "Show me your projects"
    ]
  },

  web_development: {
    keywords: [
      "web development", "web developer", "building websites", "website creation",
      "web design", "frontend", "backend", "full stack"
    ],
    responses: [
      "KMDev offers web development services including portfolio websites, business sites, web apps, and admin dashboards. Technologies used: Next.js, TypeScript, MongoDB, and modern frontend frameworks.",
      "From landing pages to full web applications, KMDev builds modern, responsive websites using Next.js, Tailwind CSS, and database-connected systems.",
      "Web development services include websites, web apps, and database solutions. Kgomotso specializes in Next.js applications with MongoDB backends."
    ],
    followUpQuestions: [
      "How much does a website cost?",
      "Can you build an admin dashboard?",
      "How can I hire you?"
    ]
  },

  services: {
    keywords: [
      "service", "services", "what do you offer", "what can you do",
      "help with", "solutions", "offerings"
    ],
    responses: [
      "KMDev services include: Website development, Web app development, Admin dashboards, Database-connected websites, Laptop repair & setup, IT support, Network setup, and Documents/presentations assistance.",
      "Services offered: Websites, web apps, admin dashboards, database systems, laptop repairs, IT support, and network troubleshooting. Contact us for a custom quote!",
      "From websites to laptop repairs, KMDev provides practical tech solutions. Services include web development, IT support, network setup, and document assistance."
    ],
    followUpQuestions: [
      "How much does it cost?",
      "Can you build my website?",
      "Do you offer IT support?"
    ]
  },

  website_services: {
    keywords: [
      "website", "make website", "build website", "create website", "design website",
      "portfolio website", "business website", "landing page"
    ],
    responses: [
      "KMDev builds professional websites for portfolios, small businesses, and personal projects. Using modern tech like Next.js and Tailwind CSS, your site will be fast and responsive.",
      "Need a website? KMDev creates portfolio sites, business websites, and landing pages. Prices depend on complexity - contact us for a personalized quote.",
      "From simple portfolios to complex business sites, KMDev has you covered. Modern design, mobile-friendly, and database-ready when you need more features."
    ],
    followUpQuestions: [
      "What's the price?",
      "How long does it take?",
      "Contact KMDev"
    ]
  },

  web_app_services: {
    keywords: [
      "web app", "web application", "app development", "software",
      "custom application", "saas", "dashboard", "portal"
    ],
    responses: [
      "KMDev builds custom web applications with database support, user authentication, and interactive features. Perfect for business tools, admin panels, and client portals.",
      "Web apps with real functionality: database connections, user management, reports, and more. Tell us your requirements and we'll build it.",
      "Need a web app? KMDev creates applications with Next.js, MongoDB, and modern frameworks. From receipt systems to admin dashboards - we build it."
    ],
    followUpQuestions: [
      "How much does it cost?",
      "Can you build an admin panel?",
      "Contact for a quote"
    ]
  },

  admin_dashboard_services: {
    keywords: [
      "admin dashboard", "admin panel", "cms", "content management",
      "management system", "control panel", "back office"
    ],
    responses: [
      "KMDev builds admin dashboards with CRUD operations, reports, data visualization, and user management. Perfect for managing your business data.",
      "Admin dashboards with database connections, reports, and easy management interfaces. Built with Next.js and MongoDB for reliability.",
      "Need to manage data? KMDev creates admin panels with full CRUD capabilities, reporting, and export features. Contact us with your requirements."
    ],
    followUpQuestions: [
      "What's the price?",
      "Can it connect to my database?",
      "Contact KMDev"
    ]
  },

  laptop_repair: {
    keywords: [
      "laptop repair", "computer repair", "pc repair", "fix computer",
      "laptop slow", "virus removal", "laptop setup", "hardware"
    ],
    responses: [
      "KMDev offers laptop repair and setup services including virus removal, software installation, performance optimization, and basic hardware troubleshooting.",
      "From slow computers to new laptop setups, KMDev provides IT support services. We help with software issues, installations, and basic hardware checks.",
      "Need laptop help? KMDev offers repair, setup, virus removal, and troubleshooting services. Contact us to discuss your issue."
    ],
    followUpQuestions: [
      "How much does it cost?",
      "Can you come to me?",
      "Contact KMDev"
    ]
  },

  it_support: {
    keywords: [
      "it support", "tech support", "computer help", "computer problems",
      "troubleshooting", "fix issue", "technology help"
    ],
    responses: [
      "KMDev provides IT support for individuals and small businesses. From software issues to network setup, we help solve your tech problems.",
      "Need tech help? KMDev offers troubleshooting, setup, and maintenance services. Whether it's a slow computer or network issue, we're here to help.",
      "IT support services include troubleshooting, system setup, network configuration, and basic repairs. Contact KMDev to describe your issue."
    ],
    followUpQuestions: [
      "What's your rate?",
      "Can you help remotely?",
      "Contact KMDev"
    ]
  },

  networking: {
    keywords: [
      "network", "networking", "router setup", "wifi setup",
      "lan", "wan", "cisco", "packet tracer", "network configuration"
    ],
    responses: [
      "KMDev has networking fundamentals and Cisco Packet Tracer experience. Services include basic network setup and troubleshooting for small networks.",
      "Networking services include router setup, WiFi configuration, and basic network troubleshooting. Kgomotso also has Cisco networking lab experience.",
      "From home WiFi setup to basic network configuration, KMDev can help. With Cisco Packet Tracer experience, network planning is also available."
    ],
    followUpQuestions: [
      "Can you set up my home network?",
      "What's your networking rate?",
      "Contact KMDev"
    ]
  },

  database_services: {
    keywords: [
      "database", "mongodb", "sql", "data storage", "data management",
      "database design", "data backup"
    ],
    responses: [
      "KMDev builds database-connected websites and applications using MongoDB. Services include database design, data management, and integration with web applications.",
      "Database solutions: MongoDB-based systems for websites, admin dashboards, and custom applications. Data modeling, management, and integration services available.",
      "Need a database? KMDev creates MongoDB-powered systems for data storage, user management, and business reporting. Contact us for your requirements."
    ],
    followUpQuestions: [
      "How much does a database system cost?",
      "Can you migrate my data?",
      "Contact KMDev"
    ]
  },

  projects: {
    keywords: [
      "project", "projects", "portfolio", "work", "built", "created",
      "show me your work", "what have you done", "previous work"
    ],
    responses: [
      "Projects include: KMDev Portfolio System (admin dashboard + services + receipts), Marketplace/Business Listing System (approval + reports + moderation), Cellphone Repair Receipt System (customer records + VAT + printable receipts), Property Listing Admin experiments, and networking lab projects.",
      "Kgomotso has built portfolio websites with admin panels, business listing platforms with moderation, receipt generation systems with VAT calculations, and networking lab projects using Cisco Packet Tracer.",
      "Notable work: Portfolio with database, business listing with approval workflow, repair receipt system with printing, and networking simulations. Each project showcases different skills."
    ],
    followUpQuestions: [
      "Show me a specific project",
      "Can you build something like that?",
      "Contact KMDev"
    ]
  },

  portfolio_project: {
    keywords: [
      "portfolio site", "portfolio system", "your portfolio",
      "this website", "how was this built"
    ],
    responses: [
      "The KMDev portfolio is a full Next.js application with MongoDB database, admin dashboard for managing content, services catalog, order system, and receipt generation.",
      "Built with Next.js, TypeScript, Tailwind CSS, and MongoDB. Features include public portfolio, services shop, order management, and printable receipts.",
      "This portfolio website showcases what's possible: modern design, database-connected features, and an admin panel for easy content management. Built by KMDev!"
    ],
    followUpQuestions: [
      "Can you build one for me?",
      "How much does it cost?",
      "Contact KMDev"
    ]
  },

  marketplace_project: {
    keywords: [
      "marketplace", "business listing", "directory", "listing platform",
      "classifieds", "business directory"
    ],
    responses: [
      "The marketplace/business listing system includes business approval workflows, admin moderation, report generation, and verification features for trusted businesses.",
      "A business listing platform with approval-based submissions, admin dashboard for moderation, reports, and verification badges for verified businesses.",
      "Built a marketplace system with features: business submissions, admin approval, reports, and verification. Perfect for local business directories."
    ],
    followUpQuestions: [
      "Can you build one?",
      "What's the price?",
      "Contact KMDev"
    ]
  },

  receipt_system_project: {
    keywords: [
      "receipt", "receipt system", "invoice", "billing",
      "pos", "point of sale", "cellphone repair"
    ],
    responses: [
      "The receipt system handles customer records, repair services, accessories, VAT calculations, discounts, and printable receipts. Perfect for repair shops and small businesses.",
      "A complete receipt solution: create customer records, log repairs, add accessories, calculate VAT/discounts, and print professional receipts.",
      "Built a receipt generation system with tax calculations, customer management, service logging, and printable receipts. Ideal for repair shops."
    ],
    followUpQuestions: [
      "Can I get this?",
      "How much for a custom receipt system?",
      "Contact KMDev"
    ]
  },

  property_project: {
    keywords: [
      "property", "real estate", "listing", "property management",
      "housing", "apartments"
    ],
    responses: [
      "Property listing admin system experiments include features for managing property listings, categories, and admin controls for real estate platforms.",
      "Explored property listing systems with admin dashboards for managing real estate data, categories, and property information.",
      "Property management experiments include admin interfaces for listing properties, organizing categories, and managing real estate data."
    ],
    followUpQuestions: [
      "Can you build a property site?",
      "What's the cost?",
      "Contact KMDev"
    ]
  },

  packet_tracer_projects: {
    keywords: [
      "packet tracer", "cisco lab", "networking lab", "network simulation",
      "ccna", "network topology"
    ],
    responses: [
      "Networking lab projects using Cisco Packet Tracer include network topologies, router configurations, switching setups, and subnetting exercises.",
      "Cisco Packet Tracer experience covers network design, router/switch configuration, IP addressing, and basic network troubleshooting simulations.",
      "Packet Tracer projects showcase networking skills: LAN setups, router configurations, VLANs, and network troubleshooting scenarios."
    ],
    followUpQuestions: [
      "Can you help with my network?",
      "Do you offer networking services?",
      "Contact KMDev"
    ]
  },

  pricing: {
    keywords: [
      "price", "pricing", "cost", "how much", "rate", "rates",
      "expensive", "cheap", "affordable", "budget"
    ],
    responses: [
      "Pricing depends on project scope and complexity. Simple websites start lower, while complex apps with databases cost more. Contact KMDev for a personalized quote!",
      "Every project is unique, so pricing is tailored to your needs. Share your requirements via WhatsApp or the contact form for an accurate estimate.",
      "KMDev offers flexible pricing based on what you need. From simple sites to complex systems, we'll work within your budget. Contact us to discuss!"
    ],
    followUpQuestions: [
      "Can I get a quote?",
      "What's included in the price?",
      "Contact KMDev"
    ]
  },

  contact: {
    keywords: [
      "contact", "reach", "get in touch", "talk to you", "message",
      "connect", "communicate"
    ],
    responses: [
      "You can contact KMDev through the contact section on this website, via WhatsApp, or by email. Visit the contact page for up-to-date details.",
      "To get in touch, check the contact section or reach out via WhatsApp. Kgomotso typically responds quickly to service inquiries.",
      "Contact KMDev via the website contact form, WhatsApp, or email. Find the contact details in the contact section of this website."
    ],
    followUpQuestions: [
      "What's your WhatsApp number?",
      "What's your email?",
      "Visit contact page"
    ]
  },

  whatsapp: {
    keywords: [
      "whatsapp", "whats app", "chat on whatsapp", "message on whatsapp",
      "contact on whatsapp"
    ],
    responses: [
      "Check the contact section of this website for the latest WhatsApp number. You can also use the contact form to send a message directly.",
      "To contact via WhatsApp, visit the contact page where the number is displayed. Feel free to send a message anytime!",
      "WhatsApp details are available in the contact section. Reach out directly for quick responses about services or quotes."
    ],
    followUpQuestions: [
      "Send a message via WhatsApp",
      "What's your email?",
      "Use the contact form"
    ]
  },

  email: {
    keywords: [
      "email", "e-mail", "send email", "mail", "gmail",
      "contact via email"
    ],
    responses: [
      "Check the contact section for the official email address. You can also use the contact form on this website for direct messaging.",
      "Email details are available in the contact section. For quick responses, consider WhatsApp or the contact form.",
      "Visit the contact page to find the email address. For immediate assistance, WhatsApp might be faster!"
    ],
    followUpQuestions: [
      "Contact via WhatsApp instead",
      "Use the contact form",
      "Visit contact page"
    ]
  },

  location: {
    keywords: [
      "location", "where are you", "address", "based in", "city",
      "gauteng", "johannesburg", "south africa"
    ],
    responses: [
      "KMDev is based in Gauteng, South Africa. Services are available locally and remotely for clients outside the area.",
      "Located in Gauteng, South Africa, KMDev serves clients locally and offers remote services nationwide.",
      "Kgomotso operates from Gauteng, South Africa. Remote support and web services are available across the country."
    ],
    followUpQuestions: [
      "Do you offer remote services?",
      "Can you visit my location?",
      "Contact KMDev"
    ]
  },

  hiring: {
    keywords: [
      "hire", "hiring", " employ", "need developer", "need help",
      "want to hire", "looking for developer"
    ],
    responses: [
      "KMDev is available for web development and IT support projects. Contact through WhatsApp or the contact form with your requirements for a quote.",
      "Looking to hire? KMDev offers competitive rates for websites, web apps, and IT support. Share your project details to get started!",
      "Available for hire! KMDev builds websites, admin dashboards, and provides IT support. Contact with your requirements for a personalized quote."
    ],
    followUpQuestions: [
      "What's your rate?",
      "What projects have you done?",
      "Contact KMDev"
    ]
  },

  availability: {
    keywords: [
      "available", "are you free", "when are you available",
      "can you start", "timeframe", "schedule"
    ],
    responses: [
      "KMDev is generally available for projects. Response time depends on current workload. Contact with your timeline for availability confirmation.",
      "Availability varies based on current projects. Contact KMDev early with your requirements to check scheduling and start planning.",
      "For availability inquiries, reach out via WhatsApp or the contact form. Include your project details and desired timeline for the best response."
    ],
    followUpQuestions: [
      "Contact KMDev",
      "What's your current workload?",
      "Send project details"
    ]
  },

  turnaround_time: {
    keywords: [
      "how long", "turnaround", "timeframe", "deadline", "when ready",
      "delivery", "completion", "how fast"
    ],
    responses: [
      "Turnaround time depends on project complexity. Simple sites might take a few days, while complex apps take longer. Discuss your timeline when requesting a quote.",
      "Delivery time varies by project scope. A simple website could be ready in 1-2 weeks, while complex systems take longer. Contact to plan your timeline.",
      "Every project is different. Small websites: few days to weeks. Complex apps: weeks to months. Share your deadline for a realistic estimate."
    ],
    followUpQuestions: [
      "Can you meet my deadline?",
      "Get a project quote",
      "Contact KMDev"
    ]
  },

  technologies: {
    keywords: [
      "technology", "tech stack", "what technology", "what do you use",
      "framework", "tools used"
    ],
    responses: [
      "KMDev uses modern web technologies: Next.js, TypeScript, Tailwind CSS, MongoDB, React, and Node.js for backend operations.",
      "Tech stack includes: Next.js for the framework, TypeScript for type safety, Tailwind CSS for styling, MongoDB for databases, and GitHub/Vercel for deployment.",
      "Modern web tech: Next.js, React, TypeScript, MongoDB, Tailwind CSS, GitHub, and Vercel. These tools ensure fast, reliable, and scalable applications."
    ],
    followUpQuestions: [
      "Can you use other technologies?",
      "Do you do WordPress?",
      "Contact KMDev"
    ]
  },

  github: {
    keywords: [
      "github", "git hub", "code repository", "source code",
      "gitlab", "bitbucket"
    ],
    responses: [
      "KMDev uses GitHub for version control and code hosting. Check the website for any public project repositories or portfolio links.",
      "Code is managed through GitHub for clean version control. Visit the website to find any public repositories or project links.",
      "GitHub is used for all project code. Look for the GitHub link on this website or contact KMDev to discuss code access."
    ],
    followUpQuestions: [
      "Can I see your code?",
      "Share your GitHub link",
      "Contact KMDev"
    ]
  },

  vercel: {
    keywords: [
      "vercel", "deploy", "hosting", "host", "deployment",
      "server", "website hosting"
    ],
    responses: [
      "KMDev deploys websites using Vercel for fast, reliable hosting. Your project can be hosted on Vercel with free SSL and global CDN.",
      "Vercel is used for deployment, ensuring fast loading, free SSL certificates, and easy updates. Contact KMDev for hosting recommendations.",
      "Most projects are deployed on Vercel for optimal performance. Hosting setup is included in most web development packages."
    ],
    followUpQuestions: [
      "Can you host my website?",
      "What's hosting cost?",
      "Contact KMDev"
    ]
  },

  mongodb: {
    keywords: [
      "mongodb", "mongo db", "no sql", "database",
      "data storage"
    ],
    responses: [
      "KMDev uses MongoDB for database solutions. It's perfect for flexible data structures, user management, and scalable applications.",
      "MongoDB powers database-connected websites and applications. From simple data storage to complex reporting, MongoDB handles it all.",
      "Most projects use MongoDB for reliable, flexible data management. Contact KMDev to discuss your data needs."
    ],
    followUpQuestions: [
      "Can you migrate my data?",
      "What's the database cost?",
      "Contact KMDev"
    ]
  },

  nextjs: {
    keywords: [
      "nextjs", "next js", "next.js", "react framework",
      "vercel framework"
    ],
    responses: [
      "KMDev specializes in Next.js for modern, fast web applications. Next.js provides great performance, SEO, and developer experience.",
      "Next.js is the framework of choice for KMDev projects. It offers server-side rendering, fast page loads, and excellent user experience.",
      "Most KMDev websites are built with Next.js for speed, SEO optimization, and modern web standards. Contact to discuss your project."
    ],
    followUpQuestions: [
      "Why Next.js?",
      "Can you build with other frameworks?",
      "Contact KMDev"
    ]
  },

  cisco: {
    keywords: [
      "cisco", "ccna", "ccnp", "networking certification",
      "cisco networking"
    ],
    responses: [
      "Kgomotso has Cisco networking foundations through Get Connected and Introduction to Cybersecurity certifications. Planning for CCNA-level growth.",
      "Cisco training includes networking fundamentals, cybersecurity basics, and Packet Tracer labs. Future goals include advanced networking certifications.",
      "Through Cisco's learning paths, Kgomotso builds networking skills alongside web development for comprehensive IT solutions."
    ],
    followUpQuestions: [
      "Do you offer networking services?",
      "Can you configure my router?",
      "Contact KMDev"
    ]
  },

  cybersecurity: {
    keywords: [
      "cyber security", "cybersecurity", "security", "protect",
      "hack", "virus", "malware"
    ],
    responses: [
      "Kgomotso has completed Cisco's Introduction to Cybersecurity course. For advanced security services, contact KMDev to discuss your needs.",
      "Basic cybersecurity knowledge is available through Cisco certifications. For comprehensive security solutions, contact KMDev.",
      "Cybersecurity awareness includes threat recognition and basic protection. Advanced security projects may require additional consultation."
    ],
    followUpQuestions: [
      "Can you check my security?",
      "Do you offer security services?",
      "Contact KMDev"
    ]
  },

  random_unrelated: {
    keywords: [
      "weather", "news", "sports", "politics", "movie",
      "game", "music", "food", "travel", "crypto", "bitcoin",
      "stock", "sports", "celebrity"
    ],
    responses: [
      "That's interesting, but I'm mainly here to help with KMDev-related questions. I can tell you about services, projects, skills, or help you get in touch!",
      "I'm focused on helping with KMDev topics. Feel free to ask about web development, IT support, projects, or how to contact us!",
      "I'm KMDev AI, here for tech and business questions. For anything else, feel free to ask, but I specialize in KMDev topics!"
    ],
    followUpQuestions: [
      "What services do you offer?",
      "Show me your projects",
      "How can I contact you?"
    ]
  },

  unknown_default: {
    keywords: [],
    responses: [
      "I'm not sure about that, but I can help you with KMDev services, projects, or skills. What would you like to explore?",
      "That information isn't available in my knowledge base, but I can help you discover what KMDev offers! Try asking about services, projects, or contact details.",
      "I can help with many KMDev topics! Try asking about services, pricing, projects, or how to get in touch. What would you like to know?"
    ],
    followUpQuestions: [
      "What services do you offer?",
      "Show me your projects",
      "How can I contact you?"
    ]
  }
};

export function matchCategory(message: string): keyof OfflineKnowledge {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const [category, data] of Object.entries(offlineKnowledge)) {
    for (const keyword of data.keywords) {
      if (lowerMessage.includes(keyword)) {
        return category as keyof OfflineKnowledge;
      }
    }
  }
  
  return "unknown_default";
}

export function getOfflineResponse(category: keyof OfflineKnowledge): { response: string; suggestions: string[] } {
  const data = offlineKnowledge[category];
  const randomIndex = Math.floor(Math.random() * data.responses.length);
  return {
    response: data.responses[randomIndex],
    suggestions: data.followUpQuestions.slice(0, 3)
  };
}