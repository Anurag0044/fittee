import { HeroSection } from "@/components/HeroSection";
import { FeaturedCollection } from "@/components/FeaturedCollection";
import { CustomDesignSection } from "@/components/CustomDesignSection";
import { PremiumFabricsSection } from "@/components/PremiumFabricsSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#0D120C]">
      <HeroSection />
      <FeaturedCollection />
      <CustomDesignSection />
      <PremiumFabricsSection />
    </main>
  );
}

