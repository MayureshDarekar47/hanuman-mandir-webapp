"use client";

import { useState } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteDonor } from "@/app/admin/actions";

type Donor = {
  id: number;
  name: string;
  amount: number;
  date: Date;
  note: string | null;
};

export default function DonorListAdmin({ donors }: { donors: Donor[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedDonors = showAll ? donors : donors.slice(0, 2);

  return (
    <div className="border-t border-gray-100 pt-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Donor List</h3>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {displayedDonors.length > 0 ? displayedDonors.map(d => (
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
              <DeleteButton
                action={async () => { await deleteDonor(d.id); }}
                message={`Delete donor "${d.name}"? This cannot be undone.`}
                label="Delete"
                className="text-red-400 hover:text-red-600 text-xs font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded"
              />
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
            {displayedDonors.length > 0 ? displayedDonors.map(d => (
              <tr key={d.id} className="hover:bg-orange-50/40 transition-colors">
                <td className="py-3 pr-4 font-semibold text-gray-900">{d.name}</td>
                <td className="py-3 pr-4 text-gray-500">{new Date(d.date).toLocaleDateString("en-IN")}</td>
                <td className="py-3 pr-4 font-bold text-green-700">₹{d.amount.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-4 text-gray-400">{d.note || "—"}</td>
                <td className="py-3 text-right">
                  <DeleteButton
                    action={async () => { await deleteDonor(d.id); }}
                    message={`Delete donor "${d.name}"? This cannot be undone.`}
                    label="Delete"
                    className="text-red-400 hover:text-red-600 text-xs font-bold"
                  />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="py-6 text-center text-gray-400">No donors added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {donors.length > 2 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all active:scale-95 px-6 py-2.5 rounded-full"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
