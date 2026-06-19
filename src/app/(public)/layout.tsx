import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MeshBackground } from "@/components/layout/MeshBackground";
import { MobileNotice } from "@/components/layout/MobileNotice";
import Chatbot from "@/components/chatbot/Chatbot";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MeshBackground />
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
      <MobileNotice />
      <Chatbot />
    </>
  );
}
