export interface KnowledgeCategory {
  responses: string[];
}

export interface OfflineKnowledge {
  who_are_you: KnowledgeCategory;
  who_is_kgomotso: KnowledgeCategory;
  services: KnowledgeCategory;
  projects: KnowledgeCategory;
  skills: KnowledgeCategory;
  certificates: KnowledgeCategory;
  contact: KnowledgeCategory;
  pricing: KnowledgeCategory;
  default: KnowledgeCategory;
}

export const offlineKnowledge: OfflineKnowledge = {
  who_are_you: {
    responses: [
      "I am KMDev AI, the official assistant for Kgomotso Mamogale's portfolio. I'm here to help you learn about KMDev services, projects, and how to get in touch.",
      "I'm KMDev AI, your guide to everything about Kgomotso Mamogale and the services offered by KMDev. Feel free to ask me anything!",
      "I'm the virtual assistant for KMDev portfolio. I can help you discover services, projects, skills, and contact information. What would you like to know?"
    ]
  },
  who_is_kgomotso: {
    responses: [
      "Kgomotso Mamogale is an IT student and web developer based in Gauteng, South Africa. He specializes in web development, IT support, and networking solutions.",
      "Kgomotso is the founder of KMDev - an IT professional offering web development, admin dashboards, database systems, and IT support services. He's currently studying NCV Level 4 IT at Ekurhuleni East TVET College.",
      "Kgomotso Mamogale builds modern websites, admin dashboards, and provides IT support solutions. He has skills in Next.js, MongoDB, networking, and more."
    ]
  },
  services: {
    responses: [
      "KMDev offers website development, web app development, admin dashboards, database-connected websites, laptop repair and setup, IT support, network setup, and troubleshooting.",
      "Services include: Portfolio websites, business websites, admin dashboards, database systems, laptop repair, IT support, and network troubleshooting. Contact me for a quote!",
      "KMDev provides web development services (HTML, CSS, JavaScript, Next.js), IT support (laptop repair, network setup), and database solutions. What do you need?"
    ]
  },
  projects: {
    responses: [
      "Projects include: KMDev Portfolio System with admin dashboard, Marketplace/Business Listing System with approval workflows, Cellphone Repair Receipt System with VAT calculations, Property Listing System, and networking lab projects using Cisco Packet Tracer.",
      "Kgomotso has built several projects including a portfolio website with services/orders/receipts system, a business listing platform with admin moderation, and a receipt generation system with customer records management.",
      "Notable projects: BMI Explorer web app, Cellphone Repair System with printable receipts, Property Admin experiments, and networking lab projects. Each showcases different skills."
    ]
  },
  skills: {
    responses: [
      "Technical skills include: HTML, CSS, Tailwind CSS, JavaScript, TypeScript, Next.js, MongoDB, SQL Server basics, GitHub, and Vercel deployment. IT skills: networking fundamentals, Cisco Packet Tracer, laptop repair, and troubleshooting.",
      "Skills span web development (frontend & backend), databases, and IT support. Core technologies: React/Next.js, MongoDB, TypeScript, Tailwind CSS. Plus hands-on IT support experience.",
      "Kgomotso is proficient in modern web development (Next.js, TypeScript, MongoDB), IT support (hardware, networking, troubleshooting), and tools like GitHub and Vercel."
    ]
  },
  certificates: {
    responses: [
      "Certificates include: Cisco Get Connected and Cisco Introduction to Cybersecurity. Kgomotso is continuously learning and working toward networking and DevNet/CCNA certifications.",
      "Current certifications: Cisco Get Connected and Introduction to Cybersecurity. Future learning path includes networking, cybersecurity, and DevNet/CCNA growth opportunities.",
      "Kgomotso holds Cisco certifications and is actively pursuing more in networking and cybersecurity. The learning journey continues!"
    ]
  },
  contact: {
    responses: [
      "You can contact KMDev through the contact section on this website, via WhatsApp, or by email. Visit the contact page to find the latest contact details and reach out directly.",
      "To contact Kgomotso: Use the contact section on this website, or send a message via WhatsApp. Check the contact page for up-to-date information.",
      "For inquiries about services or projects, visit the contact section or reach out via WhatsApp. Kgomotso typically responds quickly to service requests and quotes."
    ]
  },
  pricing: {
    responses: [
      "Pricing depends on the project requirements and complexity. You can request a personalized quote via WhatsApp or the contact form. Each service is priced based on specific needs.",
      "Service prices vary based on project scope and complexity. For an accurate quote, contact KMDev with your requirements via WhatsApp or the contact section.",
      "Every project is unique, so pricing is tailored to your specific needs. Contact KMDev to discuss your requirements and get a custom quote."
    ]
  },
  default: {
    responses: [
      "I'm not sure I understand that question, but I can help you learn about KMDev services, projects, or how to contact Kgomotso. What would you like to know?",
      "That topic isn't something I have information on yet, but feel free to ask about KMDev services, projects, skills, or contact details.",
      "I'm here to help with KMDev-related questions! Try asking about services, projects, skills, certificates, or how to get in touch."
    ]
  }
};

export function getCategoryByKeywords(message: string): keyof OfflineKnowledge {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("who are you") || lowerMessage.includes("what are you") || lowerMessage.includes("kmdev ai")) {
    return "who_are_you";
  }
  if (lowerMessage.includes("kgomotso") || lowerMessage.includes("mamogale") || lowerMessage.includes("about you")) {
    return "who_is_kgomotso";
  }
  if (lowerMessage.includes("service") || lowerMessage.includes("offer") || lowerMessage.includes("do you")) {
    return "services";
  }
  if (lowerMessage.includes("project") || lowerMessage.includes("built") || lowerMessage.includes("portfolio") || lowerMessage.includes("work")) {
    return "projects";
  }
  if (lowerMessage.includes("skill") || lowerMessage.includes("technolog") || lowerMessage.includes("language") || lowerMessage.includes("stack")) {
    return "skills";
  }
  if (lowerMessage.includes("certificate") || lowerMessage.includes("certification") || lowerMessage.includes("cisco")) {
    return "certificates";
  }
  if (lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("whatsapp") || lowerMessage.includes("reach")) {
    return "contact";
  }
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("quote") || lowerMessage.includes("hire")) {
    return "pricing";
  }
  
  return "default";
}

export function getRandomResponse(category: keyof OfflineKnowledge): string {
  const responses = offlineKnowledge[category].responses;
  return responses[Math.floor(Math.random() * responses.length)];
}