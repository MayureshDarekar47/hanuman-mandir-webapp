import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Receipt, Heart, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounts & Financials | Hanuman Mandir Darekarwadi",
  description:
    "Transparent financial summary of Hanuman Mandir, Darekarwadi. View total donations received, temple expenses, and remaining balance.",
  openGraph: {
    title: "Accounts & Financials — Hanuman Mandir Darekarwadi",
    description:
      "Full transparent financial overview of Hanuman Mandir. Total donations, expenses, and remaining balance — all publicly visible.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const revalidate = 60;

export default async function AccountsPage() {
  const [donors, expenses, balanceEntries] = await Promise.all([
    prisma.donor.findMany().catch(() => []),
    prisma.expense.findMany().catch(() => []),
    prisma.balanceEntry.findMany().catch(() => []),
  ]);

  const totalDonated = donors.reduce((s, d) => s + d.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalManualBalance = balanceEntries.reduce((s, b) => s + b.amount, 0);
  const remainingBalance = totalDonated - totalExpenses + totalManualBalance;

  const isNegative = remainingBalance < 0;
  const isZero = remainingBalance === 0;

  return (
    <main className="min-h-screen pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>
      </div>

      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Wallet size={14} /> Financial Accounts
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Temple Accounts
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Transparent financial overview of Hanuman Mandir, Darekarwadi. Every
          rupee is accounted for publicly.
        </p>
      </div>

      {/* Three Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-12">
        {/* Total Donations */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-3">
          <div className="flex items-center gap-2 opacity-80">
            <TrendingUp size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Total Donations
            </span>
          </div>
          <p
            suppressHydrationWarning
            className="text-3xl sm:text-4xl font-black leading-tight"
          >
            ₹{totalDonated.toLocaleString("en-IN")}
          </p>
          <p className="text-white/70 text-xs">
            {donors.length} donation{donors.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-3">
          <div className="flex items-center gap-2 opacity-80">
            <TrendingDown size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Total Expenses
            </span>
          </div>
          <p
            suppressHydrationWarning
            className="text-3xl sm:text-4xl font-black leading-tight"
          >
            ₹{totalExpenses.toLocaleString("en-IN")}
          </p>
          <p className="text-white/70 text-xs">
            {expenses.length} expense{expenses.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        {/* Remaining Balance */}
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-3 border-2 ${
            isNegative
              ? "bg-red-50 border-red-200 text-red-900"
              : isZero
              ? "bg-gray-50 border-gray-200 text-gray-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isNegative
                ? "text-red-500"
                : isZero
                ? "text-gray-500"
                : "text-emerald-600"
            }`}
          >
            <Wallet size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Remaining Balance
            </span>
          </div>
          <p
            suppressHydrationWarning
            className={`text-3xl sm:text-4xl font-black leading-tight ${
              isNegative
                ? "text-red-700"
                : isZero
                ? "text-gray-700"
                : "text-emerald-700"
            }`}
          >
            {isNegative ? "−" : ""}₹
            {Math.abs(remainingBalance).toLocaleString("en-IN")}
          </p>
          <p
            className={`text-xs font-medium ${
              isNegative
                ? "text-red-500"
                : isZero
                ? "text-gray-400"
                : "text-emerald-600"
            }`}
          >
            {isNegative
              ? "⚠️ Deficit — expenses exceed donations"
              : isZero
              ? "Balance is zero"
              : "✅ Surplus available"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-orange-100 mb-10" />

      {/* Navigation Buttons */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Detailed Records
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Explore itemised records of all seva activities and donor contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Seva Records Button */}
        <Link
          href="/expenses"
          className="group flex items-center justify-between bg-white border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-3xl p-8 sm:p-10 shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-200 transition-colors shadow-sm">
              <Receipt size={32} className="sm:w-10 sm:h-10" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-xl sm:text-2xl mb-1">Seva Records</p>
              <p className="text-sm sm:text-base text-gray-500">
                View all temple expense entries
              </p>
            </div>
          </div>
          <ArrowRight
            size={28}
            className="text-orange-400 group-hover:translate-x-2 transition-transform"
          />
        </Link>

        {/* Donations Button */}
        <Link
          href="/donors"
          className="group flex items-center justify-between bg-white border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-3xl p-8 sm:p-10 shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-200 transition-colors shadow-sm">
              <Heart size={32} className="sm:w-10 sm:h-10" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-xl sm:text-2xl mb-1">Donations</p>
              <p className="text-sm sm:text-base text-gray-500">
                View all donor contributions
              </p>
            </div>
          </div>
          <ArrowRight
            size={28}
            className="text-green-400 group-hover:translate-x-2 transition-transform"
          />
        </Link>
      </div>
    </main>
  );
}
