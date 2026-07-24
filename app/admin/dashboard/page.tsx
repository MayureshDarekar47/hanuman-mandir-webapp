export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Users, Bell, Calendar, Utensils, Receipt, Scale, Image as ImageIcon, QrCode, FileText, Clock, Music, Info, LayoutTemplate, Shield, LayoutDashboard } from "lucide-react";


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
import { addPaharekari, deletePaharekari, deleteAllPaharekari } from "../actions";
import { updateWhatsappSettings } from "../actions";
import DonorUploadForm from "@/components/admin/DonorUploadForm";
import DonorListAdmin from "@/components/admin/DonorListAdmin";
import { EventListAdmin, ExpenseListAdmin, BalanceListAdmin, AartiListAdmin } from "@/components/admin/AdminLists";
import SevaUploadForm from "@/components/admin/SevaUploadForm";
import MultiAartiUploadForm from "@/components/admin/MultiAartiUploadForm";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import FileUploadWithProgress from "@/components/admin/FileUploadWithProgress";
import DocumentList from "@/components/admin/DocumentList";
import PaymentManager from "@/components/admin/PaymentManager";
import MahaprasadForm from "@/components/admin/MahaprasadForm";
import MahaprasadUploadForm from "@/components/admin/MahaprasadUploadForm";
import PaharekariUploadForm from "@/components/admin/PaharekariUploadForm";
import PaharekariForm from "@/components/admin/PaharekariForm";
import CsvDownloadButton from "@/components/admin/CsvDownloadButton";
import DeleteButton from "@/components/admin/DeleteButton";

const inputCls = "flex-1 min-w-0 p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm w-full";
const btnCls = "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm whitespace-nowrap";
const sectionCls = "bg-white p-6 sm:p-8 rounded-2xl shadow-sm border-2 border-gray-900";

export default async function AdminDashboard() {
  const [notices, events, expenses, gallery, donors, aartis, heroBackgrounds, guidelines, siteSettings, timings, documents, paymentMethods, balanceEntries, mahaprasadItems, paharekariItems] = await Promise.all([
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
    prisma.paharekari.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);

  const totalDonated = donors.reduce((s, d) => s + d.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalManualBalance = balanceEntries.reduce((s, b) => s + b.amount, 0);
  const remainingBalance = totalDonated - totalExpenses + totalManualBalance;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 w-full flex-1">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <LayoutDashboard size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Dashboard</h1>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 mr-4 rounded-full"></div>
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
          <div key={s.label} className={`${s.color} rounded-2xl p-4 sm:p-5 border-2 border-current`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">{s.label}</p>
            <p className="text-xl sm:text-2xl font-black mt-1 break-words">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Donors ── */}
      <div id="manage-donors" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Users size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Donors</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
        <div className="flex justify-end items-center gap-2 flex-nowrap overflow-x-auto mb-6" style={{ scrollbarWidth: "none" }}>
          <CsvDownloadButton
            filename={`donors_${new Date().toISOString().slice(0, 10)}.csv`}
            data={donors.map(d => ({
              Name: d.name,
              Date: new Date(d.date).toLocaleDateString("en-IN"),
              "Amount (₹)": d.amount,
              Note: d.note || "",
            }))}
          />
          {donors.length > 0 && (
            <form action={async () => { "use server"; await deleteAllDonors(); }}>
              <button
                type="submit"
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-red-100"
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
          <DonorUploadForm>
            <DocumentList documents={documents as any[]} type="DONOR" />
          </DonorUploadForm>
        </div>

        <DonorListAdmin donors={donors} />
      </section>

      {/* ── Notices ── */}
      <div id="manage-notices" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Bell size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Notices</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
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
      <div id="manage-events" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Calendar size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Events</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
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
        <EventListAdmin events={events} />
      </section>

      {/* ── Mahaprasad Menu ── */}
      <div id="manage-mahaprasad" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Utensils size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Mahaprasad</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>

        <p className="text-gray-500 mt-1 text-sm"></p>
      </div>
      <section className={sectionCls}>
        <MahaprasadForm items={mahaprasadItems} />
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Bulk Import Mahaprasad</h3>
          <MahaprasadUploadForm>
            <DocumentList documents={documents as any[]} type="MAHAPRASAD" />
          </MahaprasadUploadForm>
        </div>
      </section>

      {/* ── Expenses ── */}
      <div id="manage-seva-records" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="w-1.5 sm:w-2 h-7 sm:h-9 bg-gradient-to-b from-orange-500 to-red-600 rounded-full shadow-md"></div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Seva Records</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
        <div className="flex justify-end items-center gap-2 flex-nowrap overflow-x-auto mb-6" style={{ scrollbarWidth: "none" }}>
          <CsvDownloadButton
            filename={`seva_records_${new Date().toISOString().slice(0, 10)}.csv`}
            data={expenses.map(e => ({
              Date: new Date(e.date).toLocaleDateString("en-IN"),
              Category: e.category,
              "Amount (₹)": e.amount,
              Remark: e.remark || "",
              "Family Members": e.familyMembers ?? "",
            }))}
          />
          {expenses.length > 0 && (
            <form action={async () => { "use server"; await deleteAllExpenses(); }}>
              <button
                type="submit"
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border border-red-100"
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
          <SevaUploadForm>
            <DocumentList documents={documents as any[]} type="SEVA" />
          </SevaUploadForm>
        </div>

        <ExpenseListAdmin expenses={expenses} />
      </section>

      {/* ── Balance Management ── */}
      <div id="manage-balance" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Scale size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Balance</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>

        {/* Current Balance Summary */}
        <div className={`mb-6 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${remainingBalance < 0 ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"
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
        </div>

        <BalanceListAdmin balanceEntries={balanceEntries} />
      </section>

      {/* ── Gallery ── */}
      <div id="manage-gallery" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <ImageIcon size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Gallery</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
        <div className="mb-6">
          <GalleryUploadForm />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
          {gallery.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 w-40 sm:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.altText || "Gallery"} className="w-full h-32 sm:h-40 object-cover" loading="lazy" />
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
      <div id="upi-payment-methods" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <QrCode size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage UPI Payments</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>

      </div>
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
      <div id="manage-visitor-guidelines" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <FileText size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Visitor Guidelines</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
        <form action={addGuideline} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input name="text" required placeholder="e.g. Please remove footwear outside the temple." className={inputCls} />
          <button type="submit" className={btnCls}>Add Rule</button>
        </form>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
          {guidelines.length > 0 ? guidelines.map((g) => (
            <div key={g.id} className="flex flex-col justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 gap-4 flex-shrink-0 w-64 sm:w-72">
              <p className="text-sm text-gray-800 font-medium leading-relaxed">{g.text}</p>
              <form action={async () => { "use server"; await deleteGuideline(g.id); }} className="self-end mt-auto">
                <button type="submit" className="text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Delete</button>
              </form>
            </div>
          )) : (
            <div className="py-6 text-center text-gray-400 text-sm w-full">No guidelines added yet.</div>
          )}
        </div>
      </section>

      {/* ── Temple Timings ── */}
      <div id="manage-temple-timings" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Clock size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Temple Timings</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
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
      <div id="manage-aarti-audio" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Music size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Aarti &amp; Audio</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
        <div className="mb-6">
          <MultiAartiUploadForm />
        </div>
        <AartiListAdmin aartis={aartis} />
      </section>

      {/* ── About Section Image ── */}
      <div id="about-section-image" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Info size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">About Section Image</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
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
      <div id="hero-background-management" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <LayoutTemplate size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Hero Background </h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>
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
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar" style={{ scrollbarWidth: "thin" }}>
          {heroBackgrounds.map(bg => (
            <div key={bg.id} className={`relative flex flex-col rounded-xl overflow-hidden border flex-shrink-0 w-72 snap-center ${bg.isActive ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-200"} shadow-sm bg-gray-50`}>
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

      {/* ── Paharekari ── */}
      <div id="manage-paharekari" className="scroll-mt-32 mt-12 mb-5 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 rounded-xl shadow-inner border border-white flex-shrink-0">
            <Shield size={24} strokeWidth={2.5} className="drop-shadow-sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 tracking-tight whitespace-nowrap">Manage Paharekari</h2>
          <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-2 rounded-full"></div>
        </div>
      </div>
      <section className={sectionCls}>

        {/* PaharekariForm — manual add + list */}
        <PaharekariForm items={paharekariItems as any} />

        {/* Bulk Import */}
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Bulk Import Paharekari</h3>
          <PaharekariUploadForm>
            <DocumentList documents={documents as any[]} type="PAHAREKARI" />
          </PaharekariUploadForm>
        </div>
      </section>

      {/* ══ WhatsApp & Contact Quick-Edit ══ */}
      <div id="whatsapp-settings" className="scroll-mt-32">
        <div className="mt-12 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-[#25D366]/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">WhatsApp</h2>
          </div>
          {siteSettings?.isWhatsappEnabled ? (
            <div className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 w-max">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              Live on Website
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 w-max">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Disabled
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-[#25D366]/5 via-white to-emerald-50 rounded-3xl border border-[#25D366]/20 border-l-8 border-l-[#25D366] shadow-sm p-6 sm:p-8">

        <form action={updateWhatsappSettings}>
          <div className="mb-6 flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div>
              <p className="font-bold text-gray-900">Enable WhatsApp Feature</p>
              <p className="text-xs text-gray-500">Turn OFF to hide WhatsApp buttons on donation receipt.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isWhatsappEnabled" className="sr-only peer" defaultChecked={siteSettings?.isWhatsappEnabled ?? true} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#25D366]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* WhatsApp Number box */}
            <div>
              <p className="text-base font-black text-gray-800 mb-2">📱 WhatsApp Number</p>
              <input
                name="whatsappNumber"
                defaultValue={siteSettings?.whatsappNumber || "919999999999"}
                required
                placeholder="e.g. 919876543210"
                className="w-full p-3.5 rounded-xl border-2 border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-none text-sm font-mono transition-all bg-white shadow-sm"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 pl-1">
                <span>Current:</span>
                <span className="font-mono font-bold text-gray-600">+{siteSettings?.whatsappNumber || "Not set"}</span>
              </div>
            </div>
            {/* WhatsApp Message box */}
            <div>
              <p className="text-base font-black text-gray-800 mb-2">💬 WhatsApp Message</p>
              <textarea
                name="whatsappMessage"
                defaultValue={siteSettings?.whatsappMessage || "🙏 Jai Hanuman!\n\nI have completed my donation.\nPlease find my payment screenshot attached.\n\nThank you."}
                rows={4}
                className="w-full p-3.5 rounded-xl border-2 border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-none text-sm font-mono transition-all bg-white shadow-sm resize-none"
              />
            </div>

            {/* Payment Success Title box */}
            <div>
              <p className="text-base font-black text-gray-800 mb-2">✅ Payment Success Title</p>
              <input
                name="paymentSuccessTitle"
                defaultValue={siteSettings?.paymentSuccessTitle || "Was your payment successful?"}
                placeholder="e.g. Was your payment successful?"
                className="w-full p-3.5 rounded-xl border-2 border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-none text-sm transition-all bg-white shadow-sm"
              />
            </div>
            {/* Payment Success Subtitle box */}
            <div>
              <p className="text-base font-black text-gray-800 mb-2">ℹ️ Payment Success Subtitle</p>
              <textarea
                name="paymentSuccessSubtitle"
                defaultValue={siteSettings?.paymentSuccessSubtitle || "🔒 Your donation receipt will be auto-generated & sent to the admin for verification."}
                rows={2}
                className="w-full p-3.5 rounded-xl border-2 border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-none text-sm transition-all bg-white shadow-sm resize-none"
              />
            </div>

            {/* Receipt Warning Text box */}
            <div className="md:col-span-2">
              <p className="text-base font-black text-gray-800 mb-2">⚠️ Receipt Warning Text</p>
              <textarea
                name="receiptWarningText"
                defaultValue={siteSettings?.receiptWarningText || "⚠️ Attach your payment screenshot\nWithout it, your payment will not be counted."}
                rows={2}
                className="w-full p-3.5 rounded-xl border-2 border-gray-200 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 focus:outline-none text-sm transition-all bg-white shadow-sm resize-none"
              />
            </div>

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20c45c] text-white font-black px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Save WhatsApp Settings
            </button>
          </div>
        </form>
      </div>
      </div>

    </div>
  );
}
