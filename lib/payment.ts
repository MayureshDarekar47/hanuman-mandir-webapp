import { prisma } from "./db";

export type PaymentSettings = {
  upiId: string | null;
  upiName: string | null;
  upiNote: string | null;
  qrImageUrl: string | null;
};

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const activePayment = await prisma.paymentMethod.findFirst({
      where: { isActive: true },
    });

    if (activePayment) {
      return {
        upiId: activePayment.upiId,
        upiName: activePayment.payeeName ?? null,
        upiNote: activePayment.paymentNote ?? null,
        qrImageUrl: activePayment.qrImageUrl ?? null,
      };
    }
  } catch (e) {
    console.error("Error reading payment settings from database", e);
  }

  // No active payment method found — return nulls so public site shows nothing
  return { upiId: null, upiName: null, upiNote: null, qrImageUrl: null };
}
