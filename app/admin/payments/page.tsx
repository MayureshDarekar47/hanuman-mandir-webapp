export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import PaymentManager from "@/components/admin/PaymentManager";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default async function PaymentsAdminPage() {
  const methods = await prisma.paymentMethod.findMany({
    orderBy: { createdAt: "asc" },
  });

  const active = methods.find((m) => m.isActive);

  return (
    <div className="space-y-6 pb-10">
      {/* Page title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Payment Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage UPI IDs, QR codes, and which payment method is live on the public site.
          </p>
        </div>
        <a
          href="/admin/dashboard"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
        >
          ← Back to Dashboard
        </a>
      </div>

      {/* Active payment status banner */}
      {active ? (
        <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl p-5">
          <CheckCircle2 size={22} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">Active payment method</p>
            <p className="text-green-700 text-sm mt-0.5">
              <span className="font-mono font-bold">{active.upiId}</span>
              {active.payeeName && ` — ${active.payeeName}`}
            </p>
            <p className="text-green-600 text-xs mt-1">
              The public &quot;Pay Now&quot; button and QR code are using this UPI ID right now.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <AlertCircle size={22} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-amber-800">No active payment method</p>
            <p className="text-amber-700 text-sm mt-0.5">
              The donation section will not show a &quot;Pay Now&quot; button until you mark one UPI ID as Active.
            </p>
          </div>
        </div>
      )}

      {/* Manager component */}
      <PaymentManager methods={methods} />
    </div>
  );
}
