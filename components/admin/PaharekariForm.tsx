"use client";
import { useState } from "react";
import { addPaharekari, deletePaharekari, deleteAllPaharekari } from "@/app/admin/actions";
import { Trash2, Plus, AlertTriangle, Download } from "lucide-react";

type PaharekariItemType = {
  id: number;
  name: string;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
};

// Convert 24h "HH:MM" to 12h "H:MM AM/PM"
const to12h = (time: string | null | undefined) => {
  if (!time) return "—";
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
};

// Export to CSV
const downloadCSV = (items: PaharekariItemType[]) => {
  const header = "Date,Name,Time Start,Time End";
  const rows = items.map((p) => {
    const date = p.date ? new Date(p.date).toLocaleDateString("en-IN") : "";
    const name = `"${p.name.replace(/"/g, '""')}"`;
    const start = to12h(p.startTime);
    const end = to12h(p.endTime);
    return `${date},${name},${start},${end}`;
  });
  const csv = "\uFEFF" + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `paharekari_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function PaharekariForm({ items }: { items: PaharekariItemType[] }) {
  const [loading, setLoading] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Header row */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Paharekari Duty List</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => items.length > 0 ? downloadCSV(items) : undefined}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Download CSV
          </button>
          <button
            onClick={async () => {
              if (items.length === 0) return;
              if (confirm("Are you sure you want to delete ALL Paharekari records? This cannot be undone.")) {
                setIsDeletingAll(true);
                await deleteAllPaharekari();
                setIsDeletingAll(false);
              }
            }}
            disabled={isDeletingAll || items.length === 0}
            className="flex items-center gap-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <AlertTriangle size={14} />
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </button>
        </div>
      </div>

      {/* Add Form */}
      <form
        action={async (data) => {
          setLoading(true);
          await addPaharekari(data);
          setLoading(false);
          // @ts-ignore
          document.getElementById("paharekari-form")?.reset();
        }}
        id="paharekari-form"
        className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8"
      >
        <div className="md:col-span-4">
          <input
            name="name"
            placeholder="Paharekari Name"
            required
            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="md:col-span-3">
          <input
            name="date"
            type="date"
            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <input
            name="startTime"
            type="time"
            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <input
            name="endTime"
            type="time"
            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="md:col-span-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl font-bold text-sm transition-colors flex justify-center items-center h-full disabled:opacity-50"
          >
            <Plus size={18} />
          </button>
        </div>
      </form>

      {/* Items List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No Paharekari records added yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-orange-50/50 border border-orange-100 rounded-xl"
            >
              <div>
                <p className="font-bold text-gray-900">{item.name}</p>
                <div className="flex gap-2 items-center mt-1 flex-wrap">
                  {item.date && (
                    <span className="text-[10px] bg-orange-200 text-orange-900 px-2 py-0.5 rounded-full font-semibold">
                      {new Date(item.date).toLocaleDateString("en-IN")}
                    </span>
                  )}
                  {(item.startTime || item.endTime) && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      {to12h(item.startTime)} – {to12h(item.endTime)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={async () => {
                  if (confirm("Delete this record?")) {
                    await deletePaharekari(item.id);
                  }
                }}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
