import Hero from "@/components/Hero";
import About from "@/components/About";
import Timings from "@/components/Timings";
import Guidelines from "@/components/Guidelines";
import Gallery from "@/components/Gallery";
import Aarti from "@/components/Aarti";
import Events from "@/components/Events";
import Donation from "@/components/Donation";
import Map from "@/components/Map";
import { prisma } from "@/lib/db";
import { getPaymentSettings } from "@/lib/payment";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const revalidate = 60;

export default async function Home() {
  const [galleryData, activeBg, site, anim] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.heroBackground.findFirst({ where: { isActive: true } }).catch(() => null),
    prisma.siteSettings.findFirst().catch(() => null),
    prisma.animationSettings.findFirst().catch(() => null),
  ]);
  const galleryImages = galleryData.map(g => g.url);
  const payment = await getPaymentSettings();

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
      <Donation 
        qrUrl={payment.qrImageUrl || site?.qrImageUrl || undefined} 
        upiId={payment.upiId}
        upiName={payment.upiName}
        upiNote={payment.upiNote}
      />
      <Map />
      <SpeedInsights />
    </main>
  );
}
