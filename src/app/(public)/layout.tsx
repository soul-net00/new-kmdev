import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/layout/ParticleBackground";
import Chatbot from "@/components/chatbot/Chatbot";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}