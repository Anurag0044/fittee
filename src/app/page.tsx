import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCollection } from "@/components/FeaturedCollection";
import { CustomDesignSection } from "@/components/CustomDesignSection";
import { PremiumFabricsSection } from "@/components/PremiumFabricsSection";
import { FollowSection } from "@/components/FollowSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#0D120C]">
      <Navbar />
      <HeroSection />
      <FeaturedCollection />
      <CustomDesignSection />
      <PremiumFabricsSection />
      <FollowSection />
      <Footer />
    </main>
  );
}

