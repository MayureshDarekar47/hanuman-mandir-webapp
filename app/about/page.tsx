import { Metadata } from 'next';
import About from '@/components/About';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'About Hanuman Mandir Darekarwadi | History & Significance',
  description: 'Learn about the history, spiritual significance, and community impact of the historic Hanuman Mandir located in Darekarwadi, Dhavalpuri, Parner, Ahilyanagar, Maharashtra.',
  keywords: 'about hanuman mandir, darekarwadi temple history, ahilyanagar rural temples, marathi hanuman mandir',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
  }
};

export default async function AboutPage() {
  const site = await prisma.siteSettings.findFirst().catch(() => null);

  return (
    <main className="min-h-screen py-24 flex flex-col items-center">
      <About imageUrl={site?.aboutImage || undefined} />
    </main>
  );
}
