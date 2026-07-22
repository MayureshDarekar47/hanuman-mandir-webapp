export const revalidate = 60;

import { prisma } from "@/lib/db";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Paharekari - Hanuman Mandir Darekarwadi",
  description: "Mandir Paharekari (Duty) Schedule - Volunteer duty list for Hanuman Mandir Darekarwadi.",
};

const to12h = (time: string | null | undefined) => {
  if (!time) return "—";
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
};

export default async function PaharekariPage() {
  const [records, documents] = await Promise.all([
    prisma.paharekari.findMany({
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }).catch(() => []),
    prisma.document.findMany({
      where: { type: "PAHAREKARI" },
      orderBy: { createdAt: "desc" }, // latest PDF first
    }).catch(() => []),
  ]);

  const hasContent = records.length > 0 || documents.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-24 sm:pt-28 pb-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-900 tracking-tight">
            Paharekari Duty Schedule
          </h1>
          <p className="text-orange-700/70 mt-2 text-sm sm:text-base max-w-md mx-auto">
            Hanuman Mandir Darekarwadi — Seva Volunteer Duty List
          </p>
          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 text-sm font-semibold transition-colors"
            >
              ← Back to Home
            </Link>
            {records.length > 0 && (
              <a
                href="/api/paharekari/export"
                download
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md transition-colors"
              >
                📥 Download CSV
              </a>
            )}
          </div>
        </div>

        {!hasContent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 py-20 text-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Duty Schedule Yet</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Paharekari duty schedule will be displayed here once uploaded by the admin.
            </p>
          </div>
        ) : (
          <div className="space-y-8">

            {/* ── PDF Documents FIRST (top) ── */}
            {documents.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-orange-500" />
                  Paharekari Documents / PDFs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-orange-300 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <FileText size={24} className="text-orange-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{doc.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {doc.year ? `Year ${doc.year} • ` : ""}
                          {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-xs text-orange-600 font-semibold mt-1 group-hover:underline">
                          📥 Download PDF
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── Duty Records Table ── */}
            {records.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-4">
                  <h2 className="text-white font-bold text-lg">Duty List</h2>
                  <p className="text-orange-100 text-xs mt-0.5">{records.length} records</p>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-orange-50 md:hidden">
                  {records.map((r) => (
                    <div key={r.id} className="p-4 flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {r.date
                            ? new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        {(r.startTime || r.endTime) && (
                          <p className="text-xs font-semibold text-orange-600">
                            {to12h(r.startTime)} – {to12h(r.endTime)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-orange-50 border-b border-orange-100">
                        <th className="py-3 px-5 text-xs font-bold text-orange-800 uppercase tracking-wider">#</th>
                        <th className="py-3 px-5 text-xs font-bold text-orange-800 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-5 text-xs font-bold text-orange-800 uppercase tracking-wider">Name</th>
                        <th className="py-3 px-5 text-xs font-bold text-orange-800 uppercase tracking-wider">Time Start</th>
                        <th className="py-3 px-5 text-xs font-bold text-orange-800 uppercase tracking-wider">Time End</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50">
                      {records.map((r, i) => (
                        <tr key={r.id} className="hover:bg-orange-50/60 transition-colors">
                          <td className="py-3.5 px-5 text-gray-400 text-xs font-mono">{i + 1}</td>
                          <td className="py-3.5 px-5 text-gray-600 font-medium text-xs">
                            {r.date
                              ? new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="py-3.5 px-5 font-bold text-gray-900">{r.name}</td>
                          <td className="py-3.5 px-5 text-gray-600">{to12h(r.startTime)}</td>
                          <td className="py-3.5 px-5 text-gray-600">{to12h(r.endTime)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
