export const dynamic = 'force-dynamic';

import Link from "next/link";

import { prisma } from "@/lib/db";
import {
  addNotice, deleteNotice,
  addEvent, deleteEvent,
  addExpense, deleteExpense, deleteAllExpenses,
  deleteGalleryImage,
  addDonor, deleteDonor, deleteAllDonors,
  deleteAarti,
  setHeroBackgroundActive, deleteHeroBackground,
  uploadQRCode,
  addGuideline, deleteGuideline,
  uploadAboutImage, deleteAboutImage, deleteQRCode,
  addTiming, deleteTiming,
  addBalanceEntry, deleteBalanceEntry,
} from "../actions";
import DonorUploadForm from "@/components/admin/DonorUploadForm";
import SevaUploadForm from "@/components/admin/SevaUploadForm";
import MultiAartiUploadForm from "@/components/admin/MultiAartiUploadForm";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import FileUploadWithProgress from "@/components/admin/FileUploadWithProgress";
import DocumentList from "@/components/admin/DocumentList";
import PaymentManager from "@/components/admin/PaymentManager";
import MahaprasadForm from "@/components/admin/MahaprasadForm";
import MahaprasadUploadForm from "@/components/admin/MahaprasadUploadForm";

const inputCls = "flex-1 min-w-0 p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm w-full";
const btnCls = "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm whitespace-nowrap";
const sectionCls = "bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100";

export default async function AdminDashboard() {
  const [notices, events, expenses, gallery, donors, aartis, heroBackgrounds, guidelines, siteSettings, timings, documents, paymentMethods, balanceEntries, mahaprasadItems] = await Promise.all([
    prisma.notice.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.event.findMany({ orderBy: { date: "asc" } }).catch(() => []),
    prisma.expense.findMany({ orderBy: { date: "desc" } }).catch(() => []),
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.donor.findMany({ orderBy: { date: "desc" } }).catch(() => []),
    prisma.aarti.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []),
    prisma.heroBackground.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.guideline.findMany({ orderBy: { orderIndex: "asc" } }).catch(() => []),
    prisma.siteSettings.findFirst().catch(() => null),
    prisma.timing.findMany({ orderBy: { orderIndex: "asc" } }).catch(() => []),
    prisma.document.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.paymentMethod.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []),
    prisma.balanceEntry.findMany({ orderBy: { year: "desc" } }).catch(() => []),
    prisma.mahaprasadItem.findMany({ orderBy: { orderIndex: "asc" } }).catch(() => []),
  ]);

  const totalDonated = donors.reduce((s, d) => s + d.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalManualBalance = balanceEntries.reduce((s, b) => s + b.amount, 0);
  const remainingBalance = totalDonated - totalExpenses + totalManualBalance;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage all temple content from here.</p>
        </div>
        <Link href="/admin/settings" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 border border-gray-200 flex-shrink-0">
          ⚙️ Settings
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: "Notices", value: notices.length, color: "bg-blue-50 text-blue-700" },
          { label: "Events", value: events.length, color: "bg-purple-50 text-purple-700" },
          { label: "Expenses", value: `₹${totalExpenses.toLocaleString("en-IN")}`, color: "bg-red-50 text-red-700" },
          { label: "Donations", value: `₹${totalDonated.toLocaleString("en-IN")}`, color: "bg-green-50 text-green-700" },
          {
            label: "Balance",
            value: `${remainingBalance < 0 ? "-" : ""}₹${Math.abs(remainingBalance).toLocaleString("en-IN")}`,
            color: remainingBalance < 0 ? "bg-red-100 text-red-800" : remainingBalance === 0 ? "bg-gray-50 text-gray-700" : "bg-emerald-50 text-emerald-800",
          },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 sm:p-5`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">{s.label}</p>
            <p className="text-xl sm:text-2xl font-black mt-1 break-words">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Donors ── */}
      <section className={sectionCls}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Manage Donors</h2>
            <p className="text-sm text-gray-500">Add donors manually or import from CSV, Excel, or PDF.</p>
          </div>
          {donors.length > 0 && (
            <form action={async () => { "use server"; await deleteAllDonors(); }}>
              <button 
                type="submit" 
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-red-100 mt-4 sm:mt-0"
                title="Deletes all donor records permanently"
              >
                Delete All Donors
              </button>
            </form>
          )}
        </div>

        {/* Manual add */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Add Manually</h3>
          <form action={addDonor} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="name" required placeholder="Donor Full Name" className={inputCls} />
            <input name="amount" type="number" step="0.01" required placeholder="Amount (₹)" className={inputCls} />
            <input name="date" type="date" required className={inputCls} />
            <input name="note" placeholder="Note / Purpose (optional)" className={inputCls} />
            <button type="submit" className={`${btnCls} col-span-full sm:col-span-1`}>+ Add Donor</button>
          </form>
        </div>

        {/* File Import — CSV / Excel / PDF */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Import from File</h3>
          <DonorUploadForm />
        </div>

        <DocumentList documents={documents as any[]} type="DONOR" />

        {/* Donor list */}
        {/* Donor list */}
        <div className="border-t border-gray-100 pt-6">
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {donors.length > 0 ? donors.map(d => (
              <div key={d.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-500">{new Date(d.date).toLocaleDateString("en-IN")}</p>
                  </div>
                  <p className="font-bold text-green-700">₹{d.amount.toLocaleString("en-IN")}</p>
                </div>
                {d.note && <p className="text-xs text-gray-400 italic">Note: {d.note}</p>}
                <div className="flex justify-end mt-2 pt-2 border-t border-gray-50">
                  <form action={async () => { "use server"; await deleteDonor(d.id); }}>
                    <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded">Delete</button>
                  </form>
                </div>
              </div>
            )) : (
              <div className="py-6 text-center text-gray-400">No donors added yet.</div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-hidden">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Note</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donors.length > 0 ? donors.map(d => (
                  <tr key={d.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-gray-900">{d.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{new Date(d.date).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 pr-4 font-bold text-green-700">₹{d.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 text-gray-400">{d.note || "—"}</td>
                    <td className="py-3 text-right">
                      <form action={async () => { "use server"; await deleteDonor(d.id); }}>
                        <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
                      </form>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-6 text-center text-gray-400">No donors added yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Notices ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Notices</h2>
        <form action={addNotice} className="flex flex-col gap-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input name="title" required placeholder="Notice Title" className={inputCls} />
            <input name="subtitle" placeholder="Subtitle (optional)" className={inputCls} />
            <button type="submit" className={btnCls}>Add</button>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer text-orange-600 font-semibold mb-2">Advanced SEO (Optional)</summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
              <input name="seoTitle" placeholder="SEO Title" className={inputCls} />
              <input name="focusKeyword" placeholder="Focus Keyword" className={inputCls} />
              <textarea name="metaDescription" placeholder="Meta Description" className={`${inputCls} sm:col-span-2`} rows={2} />
            </div>
          </details>
        </form>
        <ul className="space-y-2">
          {notices.map(n => (
            <li key={n.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{n.title}</p>
                {n.subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{n.subtitle}</p>}
              </div>
              <form action={async () => { "use server"; await deleteNotice(n.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Events ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Events</h2>
        <form action={addEvent} className="flex flex-col gap-3 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="title" required placeholder="Event Title" className={inputCls} />
            <input name="date" type="date" required className={inputCls} />
            <input name="description" placeholder="Description" className={`${inputCls} flex-none sm:col-span-2`} />
            <button type="submit" className={`${btnCls} sm:col-span-2`}>Add Event</button>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer text-orange-600 font-semibold mb-2">Advanced SEO (Optional)</summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
              <input name="seoTitle" placeholder="SEO Title" className={inputCls} />
              <input name="focusKeyword" placeholder="Focus Keyword" className={inputCls} />
              <textarea name="metaDescription" placeholder="Meta Description" className={`${inputCls} sm:col-span-2`} rows={2} />
            </div>
          </details>
        </form>
        <ul className="space-y-2">
          {events.map(e => (
            <li key={e.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{e.title}</p>
                <p className="text-xs text-orange-500 mt-0.5">{new Date(e.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
              </div>
              <form action={async () => { "use server"; await deleteEvent(e.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Mahaprasad Menu ── */}
      <section className={sectionCls}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Manage Mahaprasad</h2>
            <p className="text-sm text-gray-500">Add Mahaprasad entries and upload related documents.</p>
          </div>
        </div>
        <MahaprasadForm items={mahaprasadItems} />
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Bulk Import Mahaprasad</h3>
          <MahaprasadUploadForm />
        </div>
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Mahaprasad Documents</h3>
          <DocumentList documents={documents as any[]} type="MAHAPRASAD" />
        </div>
      </section>

      {/* ── Expenses ── */}
      <section className={sectionCls}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Manage Seva Records (Expenses)</h2>
            <p className="text-sm text-gray-500">Add records manually or import from CSV, Excel, or PDF.</p>
          </div>
          {expenses.length > 0 && (
            <form action={async () => { "use server"; await deleteAllExpenses(); }}>
              <button 
                type="submit" 
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-red-100 mt-4 sm:mt-0"
                title="Deletes all expense records permanently"
              >
                Delete All Seva Records
              </button>
            </form>
          )}
        </div>

        {/* Manual add */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Add Manually</h3>
          <form action={addExpense} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="date" type="date" required className={inputCls} />
            <input name="category" required placeholder="Category (e.g. Diya Oil)" className={inputCls} />
            <input name="amount" type="number" step="0.01" required placeholder="Amount (₹)" className={inputCls} />
            <input name="remark" placeholder="Remark" className={inputCls} />
            <button type="submit" className={`${btnCls} col-span-full sm:col-span-1`}>+ Add Expense</button>
          </form>
        </div>

        {/* File Import — CSV / Excel / PDF */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Import from File</h3>
          <SevaUploadForm />
        </div>

        <DocumentList documents={documents as any[]} type="SEVA" />

        {/* Expenses list */}
        <div className="border-t border-gray-100 pt-6">
          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {expenses.length > 0 ? expenses.map(e => (
              <div key={e.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{e.category}</p>
                    <p className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString("en-IN")}</p>
                  </div>
                  <p className="font-bold text-red-600">₹{e.amount.toLocaleString("en-IN")}</p>
                </div>
                {e.remark && <p className="text-xs text-gray-400 italic">Remark: {e.remark}</p>}
                <div className="flex justify-end mt-2 pt-2 border-t border-gray-50">
                  <form action={async () => { "use server"; await deleteExpense(e.id); }}>
                    <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded">Delete</button>
                  </form>
                </div>
              </div>
            )) : (
              <div className="py-6 text-center text-gray-400">No expenses added yet.</div>
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Remark</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.length > 0 ? expenses.map(e => (
                  <tr key={e.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 pr-4 text-gray-500">{new Date(e.date).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 pr-4 font-semibold text-gray-900">{e.category}</td>
                    <td className="py-3 pr-4 font-bold text-red-600">₹{e.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-4 text-gray-400">{e.remark || "—"}</td>
                    <td className="py-3 text-right">
                      <form action={async () => { "use server"; await deleteExpense(e.id); }}>
                        <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
                      </form>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-6 text-center text-gray-400">No expenses added yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Balance Management ── */}
      <section className={sectionCls}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Manage Balance</h2>
          <p className="text-sm text-gray-500">Add manual balance entries year-wise. Values can be positive, zero, or negative.</p>
        </div>

        {/* Current Balance Summary */}
        <div className={`mb-6 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
          remainingBalance < 0 ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"
        }`}>
          <span className={`font-bold text-base ${remainingBalance < 0 ? "text-red-700" : "text-emerald-700"}`}>
            Current Remaining Balance:
          </span>
          <span className={`text-2xl font-black ${remainingBalance < 0 ? "text-red-700" : "text-emerald-700"}`}>
            {remainingBalance < 0 ? "-" : ""}₹{Math.abs(remainingBalance).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Add Entry Form */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Add Balance Entry</h3>
          <form action={addBalanceEntry} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              name="year"
              type="number"
              required
              placeholder="Year (e.g. 2024)"
              min={1900}
              max={2100}
              className={inputCls}
            />
            <input
              name="amount"
              type="number"
              step="0.01"
              required
              placeholder="Amount (₹) — can be negative"
              className={inputCls}
            />
            <input
              name="note"
              placeholder="Note (optional)"
              className={inputCls}
            />
            <button type="submit" className={`${btnCls} col-span-full sm:col-span-1`}>+ Add Entry</button>
          </form>
          <p className="text-xs text-gray-400 mt-2">💡 Tip: Enter a negative amount to deduct from balance, positive to add.</p>
        </div>

        {/* Balance Entries List */}
        <div className="border-t border-gray-100 pt-6">
          {balanceEntries.length > 0 ? (
            <div className="space-y-2">
              {balanceEntries.map(b => (
                <div key={b.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm">Year: {b.year}</p>
                    {b.note && <p className="text-xs text-gray-500 mt-0.5 truncate">{b.note}</p>}
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className={`font-black text-base ${
                      b.amount < 0 ? "text-red-600" : b.amount === 0 ? "text-gray-500" : "text-emerald-700"
                    }`}>
                      {b.amount < 0 ? "-" : b.amount > 0 ? "+" : ""}₹{Math.abs(b.amount).toLocaleString("en-IN")}
                    </span>
                    <form action={async () => { "use server"; await deleteBalanceEntry(b.id); }}>
                      <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-gray-400 text-sm">No manual balance entries yet.</p>
          )}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Gallery</h2>
        <p className="text-sm text-gray-500 mb-5">Upload images for the temple gallery. Max 10MB each.</p>
        <div className="mb-6">
          <GalleryUploadForm />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {gallery.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.altText || "Gallery"} className="w-full h-28 object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <form action={async () => { "use server"; await deleteGalleryImage(img.id, img.url); }}>
                  <button type="submit" className="bg-red-500 text-white px-3 py-1.5 rounded-full font-bold text-xs hover:bg-red-600">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── UPI Payments & QR Code ── */}
      <section className={sectionCls}>
        <PaymentManager methods={paymentMethods.map(m => ({
          id: m.id,
          upiId: m.upiId,
          payeeName: m.payeeName,
          paymentNote: m.paymentNote,
          qrImageUrl: m.qrImageUrl,
          isActive: m.isActive
        }))} />
      </section>

      {/* ── Guidelines ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Visitor Guidelines</h2>
        <form action={addGuideline} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input name="text" required placeholder="e.g. Please remove footwear outside the temple." className={inputCls} />
          <button type="submit" className={btnCls}>Add Rule</button>
        </form>
        <ul className="space-y-2">
          {guidelines.length > 0 ? guidelines.map((g) => (
            <li key={g.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
              <p className="text-sm text-gray-800 font-medium min-w-0 truncate">{g.text}</p>
              <form action={async () => { "use server"; await deleteGuideline(g.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0">Delete</button>
              </form>
            </li>
          )) : (
            <li className="py-6 text-center text-gray-400 text-sm">No guidelines added yet.</li>
          )}
        </ul>
      </section>

      {/* ── Temple Timings ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Temple Timings</h2>
        <form action={addTiming} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <input name="title" required placeholder="Title (e.g. Kakad Aarti)" className={inputCls} />
          <input name="time" required placeholder="Time (e.g. 5:30 AM)" className={inputCls} />
          <input name="description" placeholder="Description (optional)" className={inputCls} />
          <button type="submit" className={`${btnCls} col-span-full`}>Add Timing</button>
        </form>
        <ul className="space-y-2">
          {timings.length > 0 ? timings.map((t) => (
            <li key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{t.title} <span className="text-orange-500 ml-2">({t.time})</span></p>
                {t.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{t.description}</p>}
              </div>
              <form action={async () => { "use server"; await deleteTiming(t.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0">Delete</button>
              </form>
            </li>
          )) : (
            <li className="py-6 text-center text-gray-400 text-sm">No timings added yet.</li>
          )}
        </ul>
      </section>

      {/* ── Aarti / Audio ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Aarti &amp; Audio</h2>
        <p className="text-sm text-gray-500 mb-6">Upload multiple songs at once. Each song needs a title and audio file. Max 30MB per song.</p>
        <div className="mb-6">
          <MultiAartiUploadForm />
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Current Playlist ({aartis.length} songs)</h3>
          <ul className="space-y-2">
            {aartis.map(a => (
              <li key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{a.title}</p>
                  <audio controls className="h-8 mt-2 w-full max-w-xs" src={a.audioUrl} />
                </div>
                <form action={async () => { "use server"; await deleteAarti(a.id, a.audioUrl); }}>
                  <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0">Delete</button>
                </form>
              </li>
            ))}
            {aartis.length === 0 && (
              <li className="py-6 text-center text-gray-400 text-sm">No audio tracks uploaded yet.</li>
            )}
          </ul>
        </div>
      </section>

      {/* ── About Section Image ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">About Section Image</h2>
        <p className="text-sm text-gray-500 mb-6">Upload the image displayed in the About section of the homepage.</p>
        <form action={async (formData) => { "use server"; await uploadAboutImage(formData); }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Image (WebP/JPG/PNG)</label>
            <input type="file" name="image" accept="image/*" required className="w-full p-2 rounded-xl border border-gray-200 bg-white" />
          </div>
          <button type="submit" className={btnCls}>Upload Image</button>
        </form>
        {siteSettings?.aboutImage && (
          <div className="mt-6 inline-block">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Current Image:</p>
            <div className="relative group inline-block rounded-xl overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={siteSettings.aboutImage} alt="About Section" className="h-40 max-w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <form action={async () => { "use server"; if (siteSettings.aboutImage) await deleteAboutImage(siteSettings.aboutImage); }}>
                  <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-red-600">Delete Image</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Hero Background Management ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Hero Background Management</h2>
        <p className="text-sm text-gray-500 mb-5">Upload a high-quality background for the homepage hero section. (Max 10MB, JPG/PNG/WebP)</p>
        <div className="mb-6">
          <FileUploadWithProgress
            endpoint="/api/upload/hero-bg"
            fieldName="image"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={10}
            label="Upload & Set Active"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 border-t border-gray-100 pt-6">Background History (Max 5 backups)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroBackgrounds.map(bg => (
            <div key={bg.id} className={`relative flex flex-col rounded-xl overflow-hidden border ${bg.isActive ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-200"} shadow-sm bg-gray-50`}>
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bg.url} alt="Hero Background" className="w-full h-full object-cover" loading="lazy" />
                {bg.isActive && (
                  <div className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-md">Active</div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <p className="text-xs text-gray-500 mb-4 font-mono">{new Date(bg.createdAt).toLocaleString("en-IN")}</p>
                <div className="flex gap-2">
                  {!bg.isActive && (
                    <form action={async () => { "use server"; await setHeroBackgroundActive(bg.id); }} className="flex-1">
                      <button type="submit" className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 px-3 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors">Restore</button>
                    </form>
                  )}
                  <form action={async () => { "use server"; await deleteHeroBackground(bg.id, bg.url, bg.mobileUrl); }} className={bg.isActive ? "w-full" : "w-auto"}>
                    <button type="submit" className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors border border-red-100">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          {heroBackgrounds.length === 0 && (
            <div className="col-span-full py-6 text-center text-gray-400 text-sm">No hero backgrounds uploaded yet. Default image will be used.</div>
          )}
        </div>
      </section>
    </div>
  );
}
