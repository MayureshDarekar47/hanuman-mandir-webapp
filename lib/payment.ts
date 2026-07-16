import fs from 'fs';
import path from 'path';

const paymentFile = path.join(process.cwd(), 'data', 'payment.json');

export type PaymentSettings = {
  upiId: string;
  upiName: string;
  upiNote: string;
};

const defaultSettings: PaymentSettings = {
  upiId: "9145685349@ybl",
  upiName: "Bhikaji Darekar",
  upiNote: "Temple Donation"
};

export function getPaymentSettings(): PaymentSettings {
  try {
    if (fs.existsSync(paymentFile)) {
      const data = fs.readFileSync(paymentFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading payment settings", e);
  }
  return defaultSettings;
}

export function savePaymentSettings(settings: PaymentSettings) {
  try {
    const dir = path.dirname(paymentFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(paymentFile, JSON.stringify(settings, null, 2), 'utf8');
  } catch (e) {
    console.error("Error saving payment settings", e);
  }
}
