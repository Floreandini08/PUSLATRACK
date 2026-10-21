import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import { FiturSection, MengapaSection } from "@/components/landing/Keunggulan";
import { CaraKerjaSection, PeranSection } from "@/components/landing/PeranSection";
import { CtaSection, Footer } from "@/components/landing/CtaFooter";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MengapaSection />
        <FiturSection />
        <PeranSection />
        <CaraKerjaSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
