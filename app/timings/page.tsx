import { Metadata } from 'next';
import Timings from '@/components/Timings';

export const metadata: Metadata = {
  title: 'Darshan & Aarti Timings | Hanuman Mandir Darekarwadi',
  description: 'Check the daily darshan and aarti schedule for Hanuman Mandir, Darekarwadi. Open for morning and evening prayers. Plan your temple visit today.',
  keywords: 'hanuman mandir timings, darshan time, aarti time darekarwadi, temple schedule ahilyanagar',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/timings`,
  }
};

export default function TimingsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <Timings />
    </main>
  );
}
