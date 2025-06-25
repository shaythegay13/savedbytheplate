
import Hero from "@/components/home/Hero";
import FeaturesSection from "@/components/home/FeaturesSection";
import MissionSection from "@/components/home/MissionSection";
import TargetAudienceSection from "@/components/home/TargetAudienceSection";
import PricingSection from "@/components/home/PricingSection";
import CallToAction from "@/components/home/CallToAction";


const Index = () => {
  return (
    <div className="min-h-screen bg-sbtp-beige">
      <Hero />
      <FeaturesSection />
      <MissionSection />
      <TargetAudienceSection />
      <PricingSection />
      <CallToAction />
    </div>
  );
};

export default Index;
