import { Metadata } from 'next';
import Map from '@/components/Map';

export const metadata: Metadata = {
  title: 'Contact & Location | Hanuman Mandir Darekarwadi',
  description: 'Get directions to Hanuman Mandir located at Darekarwadi, Dhavalpuri, Parner, Ahilyanagar. View our location on Google Maps.',
  keywords: 'hanuman mandir address, darekarwadi mandir location, dhawalpuri temple map, ahilyanagar temple contact',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
  }
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 flex flex-col w-full">
      <div className="max-w-4xl mx-auto w-full px-4 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact & Location</h1>
        <p className="text-gray-400">Visit us for daily darshan at Darekarwadi, Dhavalpuri, Parner, Ahilyanagar, Maharashtra.</p>
      </div>
      <Map />
    </main>
  );
}
