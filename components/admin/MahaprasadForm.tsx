"use client";
import { useState } from "react";
import { addMahaprasadItem, deleteMahaprasadItem, deleteAllMahaprasadItems } from "@/app/admin/actions";
import { Trash2, Plus, AlertTriangle } from "lucide-react";

type MahaprasadItemType = {
  id: number;
  name: string;
  description: string | null;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
  orderIndex: number;
};

const formatTime12h = (time: string | null | undefined) => {
  if (!time) return "?";
  const parts = time.split(":");
  if (parts.length < 2) return time;
  const h = parseInt(parts[0], 10);
  const m = parts[1];
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

export default function MahaprasadForm({ items }: { items: MahaprasadItemType[] }) {
  const [loading, setLoading] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Mahaprasad Menu</h2>
        {items.length > 0 && (
          <button
            onClick={async () => {
              if (confirm('Are you absolutely sure you want to delete ALL Mahaprasad items? This cannot be undone.')) {
                setIsDeletingAll(true);
                await deleteAllMahaprasadItems();
                setIsDeletingAll(false);
              }
            }}
            disabled={isDeletingAll}
            className="flex items-center gap-1.5 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <AlertTriangle size={14} />
            {isDeletingAll ? 'Deleting...' : 'Delete All Items'}
          </button>
        )}
      </div>
      
      <form 
        action={async (data) => {
          setLoading(true);
          await addMahaprasadItem(data);
          setLoading(false);
          // @ts-ignore - reset form
          document.getElementById('mahaprasad-form')?.reset();
        }}
        id="mahaprasad-form"
        className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8"
      >
        <div className="md:col-span-4">
          <input 
            name="name" 
            placeholder="Today's Bhojan" 
            required 
            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="md:col-span-5">
          <input 
            name="description" 
            placeholder="Description (Optional)" 
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
        
        <div className="md:col-span-3">
          <input 
            name="startTime" 
            type="time"
            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="md:col-span-3">
          <input 
            name="endTime" 
            type="time"
            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
        <div className="md:col-span-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl font-bold text-sm transition-colors flex justify-center items-center h-full disabled:opacity-50"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No Mahaprasad items added yet.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-orange-50/50 border border-orange-100 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">{item.name}</p>
                {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                <div className="flex gap-2 items-center mt-1">
                  {item.date && (
                    <span className="text-[10px] bg-orange-200 text-orange-900 px-2 py-0.5 rounded-full font-semibold">
                      {new Date(item.date).toLocaleDateString("en-IN")}
                    </span>
                  )}
                  {(item.startTime || item.endTime) && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this item?')) {
                    await deleteMahaprasadItem(item.id);
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
