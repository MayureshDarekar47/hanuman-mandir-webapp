import { prisma } from "@/lib/db";
import Link from "next/link";
import { Heart, Calendar, IndianRupee, ArrowLeft } from "lucide-react";

export default async function DonorsPage() {
  const donors = await prisma.donor.findMany({ orderBy: { date: "desc" } }).catch(() => []);
  const totalDonated = donors.reduce((s, d) => s + d.amount, 0);

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-8 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          <Heart size={14} fill="currentColor" /> Seva & Donations
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">Our Generous Donors</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          We gratefully acknowledge the seva of all devotees who have contributed to Hanuman Mandir, Darekarwadi.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-orange-600 to-amber-500 text-white rounded-3xl p-8 shadow-xl">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-2">Total Donations</p>
          <p className="text-4xl font-black">₹{totalDonated.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-xl">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">Total Donors</p>
          <p className="text-4xl font-black text-gray-900">{donors.length}</p>
        </div>
      </div>

      {/* Donor table */}
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
        <div className="px-8 py-5 border-b border-orange-100 bg-orange-50/50">
          <h2 className="font-bold text-xl text-gray-900">Donation Records</h2>
          <p className="text-sm text-gray-500 mt-1">All amounts in Indian Rupees (₹)</p>
        </div>

        <div className="overflow-x-auto">
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
                    <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {d.name.charAt(0).toUpperCase()}
                      </span>
                      {d.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-orange-400" />
                        {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                        <IndianRupee size={13} /> {d.amount.toLocaleString("en-IN")}
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
    </main>
  );
}
