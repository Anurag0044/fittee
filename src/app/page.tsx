import { HeroSection } from "@/components/HeroSection";
import { FeaturedCollection } from "@/components/FeaturedCollection";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#0D120C]">
      <HeroSection />
      <FeaturedCollection />
    </main>
  );
}
