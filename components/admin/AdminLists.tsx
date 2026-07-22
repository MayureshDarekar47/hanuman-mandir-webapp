"use client";

import { useState } from "react";
import { deleteEvent, deleteExpense, deleteBalanceEntry, deleteAarti } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";

// -- EVENTS --
export function EventListAdmin({ events }: { events: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? events : events.slice(0, 2);

  return (
    <>
      <ul className="space-y-2">
        {events.length === 0 && <li className="py-6 text-center text-gray-400 text-sm">No events added yet.</li>}
        {displayed.map(e => (
          <li key={e.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{e.title}</p>
              <p className="text-xs text-orange-500 mt-0.5">{new Date(e.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
            </div>
            <button onClick={async () => await deleteEvent(e.id)} className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0">Delete</button>
          </li>
        ))}
      </ul>
      {events.length > 2 && (
        <div className="flex justify-end mt-4">
          <button type="button" onClick={() => setShowAll(!showAll)} className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all active:scale-95 px-6 py-2.5 rounded-full">
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </>
  );
}

// -- EXPENSES --
export function ExpenseListAdmin({ expenses }: { expenses: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? expenses : expenses.slice(0, 2);

  return (
    <div className="border-t border-gray-100 pt-6">
      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {displayed.length > 0 ? displayed.map(e => (
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
              <DeleteButton
                action={async () => { await deleteExpense(e.id); }}
                message={`Delete seva record "${e.category}"? This cannot be undone.`}
                label="Delete"
                className="text-red-400 hover:text-red-600 text-xs font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded"
              />
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
            {displayed.length > 0 ? displayed.map(e => (
              <tr key={e.id} className="hover:bg-orange-50/40 transition-colors">
                <td className="py-3 pr-4 text-gray-500">{new Date(e.date).toLocaleDateString("en-IN")}</td>
                <td className="py-3 pr-4 font-semibold text-gray-900">{e.category}</td>
                <td className="py-3 pr-4 font-bold text-red-600">₹{e.amount.toLocaleString("en-IN")}</td>
                <td className="py-3 pr-4 text-gray-400">{e.remark || "—"}</td>
                <td className="py-3 text-right">
                  <DeleteButton
                    action={async () => { await deleteExpense(e.id); }}
                    message={`Delete seva record "${e.category}"? This cannot be undone.`}
                    label="Delete"
                    className="text-red-400 hover:text-red-600 text-xs font-bold"
                  />
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="py-6 text-center text-gray-400">No expenses added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {expenses.length > 2 && (
        <div className="flex justify-end mt-4">
          <button type="button" onClick={() => setShowAll(!showAll)} className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all active:scale-95 px-6 py-2.5 rounded-full">
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

// -- BALANCE --
export function BalanceListAdmin({ balanceEntries }: { balanceEntries: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? balanceEntries : balanceEntries.slice(0, 2);

  return (
    <div className="border-t border-gray-100 pt-6">
      {balanceEntries.length > 0 ? (
        <div className="space-y-2">
          {displayed.map(b => (
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
                <button onClick={async () => await deleteBalanceEntry(b.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-gray-400 text-sm">No manual balance entries yet.</p>
      )}

      {balanceEntries.length > 2 && (
        <div className="flex justify-end mt-4">
          <button type="button" onClick={() => setShowAll(!showAll)} className="text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all active:scale-95 px-6 py-2.5 rounded-full">
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

// -- AARTI --
export function AartiListAdmin({ aartis }: { aartis: any[] }) {
  return (
    <div className="border-t border-gray-100 pt-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Current Playlist ({aartis.length} songs)</h3>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
        {aartis.map(a => (
          <div key={a.id} className="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3 flex-shrink-0 w-64 sm:w-72">
            <div className="flex justify-between items-start gap-2">
              <p className="font-bold text-gray-900 text-sm truncate pt-1">{a.title}</p>
              <button onClick={async () => await deleteAarti(a.id, a.audioUrl)} className="text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold transition-colors flex-shrink-0">Delete</button>
            </div>
            <audio controls className="h-8 w-full" src={a.audioUrl} />
          </div>
        ))}
        {aartis.length === 0 && (
          <div className="py-6 text-center text-gray-400 text-sm w-full">No audio tracks uploaded yet.</div>
        )}
      </div>
    </div>
  );
}
