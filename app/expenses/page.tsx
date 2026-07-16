import { prisma } from "@/lib/db";
import { Receipt, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import PublicDocumentList from "@/components/PublicDocumentList";

export const metadata: Metadata = {
  title: "Mandir Seva Records | Temple Expenses",
  description:
    "Transparent records of temple expenses and seva activities at Hanuman Mandir, Darekarwadi. All funds are used for temple maintenance and community events.",
  openGraph: {
    title: "Mandir Seva Records — Hanuman Mandir Darekarwadi",
    description:
      "Full transparent ledger of Hanuman Mandir seva expenses. Every rupee donated is accounted for publicly.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function ExpensesPage() {
  const [expenses, documents] = await Promise.all([
    prisma.expense.findMany({ orderBy: { date: "desc" } }).catch(() => []),
    prisma.document.findMany({ where: { type: "SEVA" }, orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <main className="min-h-screen pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Top actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
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
        
        <div className="flex items-center gap-3">
          <a 
            href="/api/download/expenses"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Download size={16} />
            Download CSV
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Receipt size={14} /> Seva Records
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
          Mandir Seva Records
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Transparent records of temple expenses and seva activities at Hanuman
          Mandir, Darekarwadi. All funds are used for temple maintenance and
          community events.
        </p>
      </div>

      {/* PDF Reports Section */}
      <PublicDocumentList documents={documents as any[]} title="Seva Records" />

      {/* Total */}
      <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-xl">
        <span className="font-bold text-lg">Total Expenditure:</span>
        <span className="text-2xl sm:text-3xl font-black">
          ₹{totalExpense.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-orange-100 bg-orange-50/50">
          <h2 className="font-bold text-xl text-gray-900">
            Seva Material Expenses
          </h2>
          <p className="text-sm text-gray-500 mt-1">All amounts in Indian Rupees (₹)</p>
        </div>
        <div className="border-t border-orange-100">
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 divide-y divide-gray-100 md:hidden">
            {expenses.length > 0 ? (
              expenses.map((exp) => (
                <div key={exp.id} className="p-4 sm:p-6 bg-white hover:bg-orange-50/40 transition-colors flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 leading-tight">{exp.category}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
                      ₹{exp.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {exp.remark && (
                    <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                      Remark: {exp.remark}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-400">
                <Receipt className="mx-auto mb-3 text-orange-200" size={40} />
                <p className="font-medium">No seva records yet.</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.length > 0 ? (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(exp.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{exp.category}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                          ₹{exp.amount.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{exp.remark || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-400">
                      <Receipt className="mx-auto mb-3 text-orange-200" size={40} />
                      <p className="font-medium">No seva records yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
