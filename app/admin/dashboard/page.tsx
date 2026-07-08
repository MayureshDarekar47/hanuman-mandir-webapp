import { prisma } from "@/lib/db";
import {
  addNotice, deleteNotice,
  addEvent, deleteEvent,
  addExpense, deleteExpense,
  uploadGalleryImage, deleteGalleryImage,
  addDonor, deleteDonor, importDonorsFromCSV,
  uploadAarti, deleteAarti,
  uploadHeroBackground, setHeroBackgroundActive, deleteHeroBackground,
  uploadQRCode,
  addGuideline, deleteGuideline,
  uploadAboutImage, deleteAboutImage, deleteQRCode,
  addTiming, deleteTiming,
} from "../actions";


const inputCls = "flex-1 p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm";
const btnCls = "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm";
const sectionCls = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100";

export default async function AdminDashboard() {
  const [notices, events, expenses, gallery, donors, aartis, heroBackgrounds, guidelines, siteSettings, timings] = await Promise.all([
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
  ]);


  const totalDonated = donors.reduce((s, d) => s + d.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-10 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage all temple content from here.</p>
        </div>
        <a href="/admin/settings" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 border border-gray-200">
          ⚙️ Go to Settings
        </a>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Notices", value: notices.length, color: "bg-blue-50 text-blue-700" },
          { label: "Events", value: events.length, color: "bg-purple-50 text-purple-700" },
          { label: "Expenses", value: `₹${totalExpenses.toLocaleString("en-IN")}`, color: "bg-red-50 text-red-700" },
          { label: "Donations", value: `₹${totalDonated.toLocaleString("en-IN")}`, color: "bg-green-50 text-green-700" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Donors ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Donors</h2>
        <p className="text-sm text-gray-500 mb-6">Add donors manually or bulk-import from a CSV/Excel file.</p>

        {/* Manual add */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Add Manually</h3>
          <form action={addDonor} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="name" required placeholder="Donor Full Name" className={inputCls} />
            <input name="amount" type="number" step="0.01" required placeholder="Amount (₹)" className={inputCls} />
            <input name="date" type="date" required className={inputCls} />
            <input name="note" placeholder="Note / Purpose (optional)" className={inputCls} />
            <button type="submit" className={`${btnCls} col-span-full md:col-span-1`}>+ Add Donor</button>
          </form>
        </div>

        {/* CSV Import */}
        <div className="mb-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Import from CSV / Excel</h3>
          <p className="text-xs text-gray-400 mb-3">
            Save Excel as CSV. Column order: <code className="bg-gray-100 px-1 rounded">Name, Amount, Date (dd/mm/yyyy), Note</code> — first row is header and will be skipped.
          </p>
          <form action={importDonorsFromCSV} className="flex gap-3">
            <input
              name="csv" type="file" accept=".csv"
              className={`${inputCls} file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200`}
            />
            <button type="submit" className={btnCls}>Import CSV</button>
          </form>
        </div>

        {/* Donor list */}
        <div className="border-t border-gray-100 pt-6 overflow-x-auto">
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
                  <td className="py-3">
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
      </section>

      {/* ── Notices ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Notices</h2>
        <form action={addNotice} className="flex gap-3 mb-5">
          <input name="title" required placeholder="Notice Title" className={inputCls} />
          <input name="subtitle" placeholder="Subtitle (optional)" className={inputCls} />
          <button type="submit" className={btnCls}>Add</button>
        </form>
        <ul className="space-y-2">
          {notices.map(n => (
            <li key={n.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{n.title}</p>
                {n.subtitle && <p className="text-xs text-gray-500 mt-0.5">{n.subtitle}</p>}
              </div>
              <form action={async () => { "use server"; await deleteNotice(n.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Events ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Events</h2>
        <form action={addEvent} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <input name="title" required placeholder="Event Title" className={inputCls} />
          <input name="date" type="date" required className={inputCls} />
          <input name="description" placeholder="Description" className={`${inputCls} md:col-span-2`} />
          <button type="submit" className={btnCls}>Add Event</button>
        </form>
        <ul className="space-y-2">
          {events.map(e => (
            <li key={e.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{e.title}</p>
                <p className="text-xs text-orange-500 mt-0.5">{new Date(e.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
              </div>
              <form action={async () => { "use server"; await deleteEvent(e.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Expenses ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Seva Records (Expenses)</h2>
        <form action={addExpense} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <input name="date" type="date" required className={inputCls} />
          <input name="category" required placeholder="Category (e.g. Diya Oil)" className={inputCls} />
          <input name="amount" type="number" required placeholder="Amount (₹)" className={inputCls} />
          <input name="remark" placeholder="Remark" className={inputCls} />
          <button type="submit" className={btnCls}>Add Expense</button>
        </form>
        <ul className="space-y-2">
          {expenses.map(e => (
            <li key={e.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{e.category} — <span className="text-red-600">₹{e.amount}</span></p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(e.date).toLocaleDateString("en-IN")} {e.remark ? `· ${e.remark}` : ""}</p>
              </div>
              <form action={async () => { "use server"; await deleteExpense(e.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Gallery ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Gallery</h2>
        <form action={uploadGalleryImage} className="flex gap-3 mb-6">
          <input name="image" type="file" accept="image/*" required
            className={`${inputCls} file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200`} />
          <button type="submit" className={btnCls}>Upload</button>
        </form>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={img.url} alt={img.altText || "Gallery"} className="w-full h-28 object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <form action={async () => { "use server"; await deleteGalleryImage(img.id, img.url); }}>
                  <button type="submit" className="bg-red-500 text-white px-3 py-1.5 rounded-full font-bold text-xs hover:bg-red-600">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QR Code Upload ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Donation QR Code</h2>
        <p className="text-sm text-gray-500 mb-6">Upload the UPI QR code PNG that appears on the donation section of the website. (Max 5MB, PNG/JPG)</p>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Upload form */}
          <form action={async (formData) => { "use server"; await uploadQRCode(formData); }} className="flex gap-3 items-start flex-1">
            <input
              name="qr"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
              className={`${inputCls} file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200`}
            />
            <button type="submit" className={btnCls}>Upload QR</button>
          </form>
          {/* Live preview */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current QR</p>
            <div className="w-36 h-36 border-2 border-dashed border-orange-200 rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center relative group">
              {siteSettings?.qrImageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={siteSettings.qrImageUrl}
                    alt="Current QR Code"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <form action={async () => { "use server"; if(siteSettings.qrImageUrl) await deleteQRCode(siteSettings.qrImageUrl); }}>
                       <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-colors">Delete QR</button>
                    </form>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400 text-center px-2">No QR uploaded yet</p>
              )}
            </div>
            <p className="text-xs text-gray-400">{siteSettings?.qrImageUrl ? "Supabase Storage" : "Not set"}</p>
          </div>
        </div>
      </section>

      {/* ── Guidelines ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Visitor Guidelines</h2>
        <form action={addGuideline} className="flex gap-3 mb-6">
          <input
            name="text"
            required
            placeholder="e.g. Please remove footwear outside the temple."
            className={inputCls}
          />
          <button type="submit" className={btnCls}>Add Rule</button>
        </form>
        <ul className="space-y-2">
          {guidelines.length > 0 ? guidelines.map((g) => (
            <li key={g.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-800 font-medium">{g.text}</p>
              <form action={async () => { "use server"; await deleteGuideline(g.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold ml-4 flex-shrink-0">Delete</button>
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
        <form action={addTiming} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <input name="title" required placeholder="Title (e.g. Kakad Aarti)" className={inputCls} />
          <input name="time" required placeholder="Time (e.g. 5:30 AM)" className={inputCls} />
          <input name="description" placeholder="Description (optional)" className={inputCls} />
          <button type="submit" className={`${btnCls} md:col-span-3`}>Add Timing</button>
        </form>
        <ul className="space-y-2">
          {timings.length > 0 ? timings.map((t) => (
            <li key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{t.title} <span className="text-orange-500 ml-2">({t.time})</span></p>
                {t.description && <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>}
              </div>
              <form action={async () => { "use server"; await deleteTiming(t.id); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
              </form>
            </li>
          )) : (
            <li className="py-6 text-center text-gray-400 text-sm">No timings added yet.</li>
          )}
        </ul>
      </section>

      {/* ── Aarti / Audio ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Aarti & Audio</h2>
        <form action={uploadAarti} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <input name="title" required placeholder="Audio Title (e.g., Hanuman Chalisa)" className={inputCls} />
          <input name="subtitle" placeholder="Subtitle (optional)" className={inputCls} />
          <input name="audio" type="file" accept="audio/*" required
            className={`${inputCls} md:col-span-2 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200`} />
          <button type="submit" className={`${btnCls} md:col-span-2`}>Upload Audio</button>
        </form>
        <ul className="space-y-2">
          {aartis.map(a => (
            <li key={a.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{a.title}</p>
                <audio controls className="h-8 mt-2 w-64" src={a.audioUrl} />
              </div>
              <form action={async () => { "use server"; await deleteAarti(a.id, a.audioUrl); }}>
                <button type="submit" className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* ── About Section Image ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">About Section Image</h2>
        <p className="text-sm text-gray-500 mb-6">Upload the image displayed in the About section of the homepage.</p>
        <form action={async (formData) => { "use server"; await uploadAboutImage(formData); }} className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Image (WebP/JPG/PNG)</label>
            <input type="file" name="image" accept="image/*" required className="w-full p-2 rounded-xl border border-gray-200 bg-white" />
          </div>
          <button type="submit" className={`${btnCls} mt-5`}>Upload Image</button>
        </form>
        {siteSettings?.aboutImage && (
          <div className="mt-6 inline-block">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Current Image:</p>
            <div className="relative group inline-block rounded-xl overflow-hidden shadow-sm">
              <img src={siteSettings.aboutImage} alt="About Section" className="h-40 object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <form action={async () => { "use server"; if(siteSettings.aboutImage) await deleteAboutImage(siteSettings.aboutImage); }}>
                  <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-colors">Delete Image</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Hero Background Management ── */}
      <section className={sectionCls}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Hero Background Management</h2>
        <p className="text-sm text-gray-500 mb-6">Upload a high-quality background for the homepage hero section. The system will automatically compress and generate mobile versions. (Max 10MB, JPG/PNG/WebP)</p>
        
        <form action={async (formData) => { "use server"; await uploadHeroBackground(formData); }} className="flex gap-3 mb-6">
          <input name="image" type="file" accept="image/jpeg, image/png, image/webp" required
            className={`${inputCls} file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200`} />
          <button type="submit" className={btnCls}>Upload & Set Active</button>
        </form>

        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 border-t border-gray-100 pt-6">Background History (Max 5 backups)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroBackgrounds.map(bg => (
            <div key={bg.id} className={`relative flex flex-col rounded-xl overflow-hidden border ${bg.isActive ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-200'} shadow-sm bg-gray-50`}>
              <div className="relative h-40">
                <img src={bg.url} alt="Hero Background" className="w-full h-full object-cover" />
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
