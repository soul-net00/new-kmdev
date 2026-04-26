import type { Metadata } from "next";
import "./globals.css";
import { AppSessionProvider } from "@/components/providers/SessionProvider";

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3001";

export const metadata: Metadata = {
  title: {
    default: "KMDev — Kgomotso Mamogale",
    template: "%s | KMDev"
  },
  description: "Developer portfolio, services, admin dashboard, and order management for KMDev.",
  keywords: ["KMDev", "Kgomotso Mamogale", "portfolio", "Next.js", "IT support", "web developer"],
  metadataBase: new URL(NEXTAUTH_URL),
  openGraph: {
    title: "KMDev",
    description: "Modern full-stack portfolio by Kgomotso Mamogale.",
    images: ["/og-image.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "KMDev",
    description: "Developer portfolio, services, and admin dashboard.",
    images: ["/og-image.png"]
  }
};

const themeScript = `(() => {
  try {
    const saved = localStorage.getItem('kmdev-theme');
    const theme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AppSessionProvider>
          {children}
        </AppSessionProvider>
      </body>
    </html>
  );
}