"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { ScrollRevealInit } from "@/components/scroll-reveal";
import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { LiveDemo } from "@/components/sections/live-demo";
import { AuditForm } from "@/components/sections/audit-form";
import { WhyMapScor } from "@/components/sections/why-mapscor";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { CTABottom } from "@/components/sections/cta-bottom";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Features />
        <LiveDemo />
        <AuditForm />
        <WhyMapScor />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABottom />
      </main>
      <Footer />
    </>
  );
}
