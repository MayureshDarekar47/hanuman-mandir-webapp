import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Hanuman Mandir Darekarwadi',
  description: 'Privacy policy for Hanuman Mandir Darekarwadi regarding user data, donations, and online services.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full prose prose-invert">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information Collection</h2>
          <p className="text-gray-300">Hanuman Mandir Darekarwadi collects basic information required for donation receipts and event registrations. We do not sell or share personal data.</p>
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">2. Donations</h2>
          <p className="text-gray-300">All online donations via UPI are processed securely. Your donation records may be displayed on our Donors page for transparency, unless requested otherwise.</p>
        </section>
      </div>
    </main>
  );
}
