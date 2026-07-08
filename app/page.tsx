import Hero from "@/components/Hero";
import About from "@/components/About";
import Timings from "@/components/Timings";
import Guidelines from "@/components/Guidelines";
import Notices from "@/components/Notices";
import Gallery from "@/components/Gallery";
import Aarti from "@/components/Aarti";
import Events from "@/components/Events";
import Donation from "@/components/Donation";
import Map from "@/components/Map";
import { prisma } from "@/lib/db";

export default async function Home() {
  const [galleryData, activeBg, site, anim] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.heroBackground.findFirst({ where: { isActive: true } }).catch(() => null),
    prisma.siteSettings.findFirst().catch(() => null),
    prisma.animationSettings.findFirst().catch(() => null),
  ]);
  const galleryImages = galleryData.map(g => g.url);

  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero 
        bgUrl={activeBg?.url || undefined} 
        mobileBgUrl={activeBg?.mobileUrl || undefined}
        siteSettings={site}
        animationSettings={anim}
      />
      <About imageUrl={site?.aboutImage || undefined} />
      <Gallery galleryImages={galleryImages} />
      <Timings />
      <Aarti />
      <Events />
      <Guidelines />
      <Notices />
      <Donation qrUrl={site?.qrImageUrl || undefined} />
      <Map />
    </main>
  );
}
