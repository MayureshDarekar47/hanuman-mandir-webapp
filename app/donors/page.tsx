import { prisma } from "@/lib/db";
import Link from "next/link";
import { Heart, Calendar, IndianRupee, ArrowLeft, Download } from "lucide-react";
import type { Metadata } from "next";
import PublicDocumentList from "@/components/PublicDocumentList";

export const metadata: Metadata = {
  title: "Our Generous Donors | Seva & Donations",
  description:
    "We gratefully acknowledge the seva of all devotees who have contributed to Hanuman Mandir, Darekarwadi. View complete transparent donation records.",
  openGraph: {
    title: "Donors — Hanuman Mandir Darekarwadi",
    description:
      "Full transparent ledger of all donations to Hanuman Mandir, Darekarwadi. Every rupee is accounted for publicly.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function DonorsPage() {
  const [donors, documents] = await Promise.all([
    prisma.donor.findMany({ orderBy: { date: "desc" } }).catch(() => []),
    prisma.document.findMany({ where: { type: "DONOR" }, orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);
  
  const totalDonated = donors.reduce((s, d) => s + d.amount, 0);

  return (
    <main className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
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
            href="/api/download/donors"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Download size={16} />
            Download CSV
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Heart size={14} fill="currentColor" /> Seva &amp; Donations
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
          Our Generous Donors
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          We gratefully acknowledge the seva of all devotees who have
          contributed to Hanuman Mandir, Darekarwadi.
        </p>
      </div>

      {/* PDF Reports Section */}
      <PublicDocumentList documents={documents as any[]} title="Donors" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
        <div className="bg-gradient-to-br from-orange-600 to-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-2">
            Total Donations
          </p>
          <p className="text-3xl sm:text-4xl font-black">
            ₹{totalDonated.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 shadow-xl">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">
            Total Donors
          </p>
          <p className="text-3xl sm:text-4xl font-black text-gray-900">
            {donors.length}
          </p>
        </div>
      </div>

      {/* Donor table */}
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-orange-100 bg-orange-50/50">
          <h2 className="font-bold text-xl text-gray-900">Donation Records</h2>
          <p className="text-sm text-gray-500 mt-1">
            All amounts in Indian Rupees (₹)
          </p>
        </div>

        <div className="border-t border-orange-100">
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 divide-y divide-gray-100 md:hidden">
            {donors.length > 0 ? (
              donors.map((d, idx) => (
                <div key={d.id} className="p-4 sm:p-6 bg-white hover:bg-orange-50/40 transition-colors flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {d.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">{d.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Calendar size={12} className="text-orange-400" />
                          {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full text-sm">
                      <IndianRupee size={12} />
                      {d.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {d.note && (
                    <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg ml-11">
                      Note: {d.note}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-400">
                <Heart className="mx-auto mb-3 text-orange-200" size={40} />
                <p className="font-medium">No donation records yet.</p>
              </div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor Name</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donors.length > 0 ? (
                  donors.map((d, idx) => (
                    <tr key={d.id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-400">{idx + 1}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        <span className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                            {d.name.charAt(0).toUpperCase()}
                          </span>
                          <span>{d.name}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={12} className="text-orange-400 flex-shrink-0" />
                          {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                          <IndianRupee size={12} />
                          {d.amount.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{d.note || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-400">
                      <Heart className="mx-auto mb-3 text-orange-200" size={40} />
                      <p className="font-medium">No donation records yet.</p>
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
