import { Metadata } from 'next';
import Donation from '@/components/Donation';
import { prisma } from '@/lib/db';
import { getPaymentSettings } from '@/lib/payment';

export const metadata: Metadata = {
  title: 'Donate Online | Hanuman Mandir Darekarwadi Seva',
  description: 'Make a secure online donation to Hanuman Mandir, Darekarwadi via UPI. Support the temple maintenance, daily aarti, and community events.',
  keywords: 'hanuman mandir donation, temple donation online, upi donation temple, darekarwadi mandir seva',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/donation`,
  }
};

export default async function DonationPage() {
  const [site, payment] = await Promise.all([
    prisma.siteSettings.findFirst().catch(() => null),
    getPaymentSettings(),
  ]);

  return (
    <main className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <Donation 
        qrUrl={payment.qrImageUrl || site?.qrImageUrl || undefined} 
        upiId={payment.upiId}
        upiName={payment.upiName}
        upiNote={payment.upiNote}
        whatsappNumber={site?.whatsappNumber}
        whatsappMessage={site?.whatsappMessage}
        paymentSuccessTitle={site?.paymentSuccessTitle}
        paymentSuccessSubtitle={site?.paymentSuccessSubtitle}
        receiptWarningText={site?.receiptWarningText}
        isWhatsappEnabled={site?.isWhatsappEnabled ?? true}
      />
    </main>
  );
}
