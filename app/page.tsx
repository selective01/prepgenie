import Navbar           from "@/components/layout/Navbar";
import Hero             from "@/components/sections/Hero";
import Features         from "@/components/sections/Features";
import HowItWorks       from "@/components/sections/HowItWorks";
import Pricing          from "@/components/sections/Pricing";
import Testimonials     from "@/components/sections/Testimonials";
import FAQ              from "@/components/sections/FAQ";
import CTA              from "@/components/sections/CTA";
import Footer           from "@/components/layout/Footer";
import ScrollRevealInit from "@/components/ui/ScrollRevealInit";

export default function Home() {
  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
