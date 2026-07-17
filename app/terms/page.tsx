import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Hanuman Mandir Darekarwadi',
  description: 'Terms and conditions for using the Hanuman Mandir Darekarwadi website and services.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/terms`,
  }
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full prose prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300">By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">2. Donations</h2>
          <p className="text-gray-300">All donations made to Hanuman Mandir are voluntary and non-refundable. The temple trust reserves the right to utilize the funds for temple maintenance, events, and community service.</p>
        </section>
      </div>
    </main>
  );
}
