import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seva Records | Hanuman Mandir Darekarwadi',
  description: 'View the monthly seva records and temple expenses for Hanuman Mandir Darekarwadi. Transparency in temple operations.',
  keywords: 'temple seva darekarwadi, mandir expenses, hanuman mandir transparency',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/seva`,
  }
};

export default function SevaPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-temple-saffron">Temple Seva</h1>
        <p className="text-lg text-gray-300 mb-8">
          The records of monthly expenses and community service (Seva) are maintained by the temple trust. Please visit the Expenses section for a detailed breakdown.
        </p>
        <a href="/expenses" className="inline-block bg-temple-saffron text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors">
          View Detailed Expenses
        </a>
      </div>
    </main>
  );
}
