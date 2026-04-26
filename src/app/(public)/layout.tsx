import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/layout/ParticleBackground";
import { MobileNotice } from "@/components/layout/MobileNotice";
import Chatbot from "@/components/chatbot/Chatbot";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileNotice />
      <Chatbot />
    </>
  );
}