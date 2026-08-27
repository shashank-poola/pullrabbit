import { SiteHeader } from "@/components/landing/SiteHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CompetitorsSection } from "@/components/landing/CompetitorsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { WaitlistSection } from "@/components/landing/WaitlistSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#171717]">
      <SiteHeader />
      <div className="mx-auto max-w-[1000px] border-x border-[#e9e9e9]">
        <HeroSection />
        <FeaturesGrid />
        <FeaturesSection />
        <CompetitorsSection />
        <FAQSection />
        <WaitlistSection />
      </div>
      <LandingFooter />
    </main>
  );
}
