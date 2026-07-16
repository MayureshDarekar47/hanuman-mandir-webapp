"use client";

import { useState } from "react";
import { updateDocumentYear, deleteDocument } from "@/app/admin/actions";
import { FileText, Calendar, Trash2, Edit2, Check, X } from "lucide-react";

type Doc = {
  id: number;
  title: string;
  url: string;
  year: number | null;
  type: string;
  createdAt: Date;
};

export default function DocumentList({ documents, type }: { documents: Doc[], type: string }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editYear, setEditYear] = useState<number | string>("");

  const filteredDocs = documents.filter(d => d.type === type);

  const handleSave = async (id: number) => {
    const yearNum = typeof editYear === "string" ? parseInt(editYear) : editYear;
    await updateDocumentYear(id, isNaN(yearNum) ? null : yearNum);
    setEditingId(null);
  };

  if (filteredDocs.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
        Uploaded PDF Reports
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
              <FileText size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate" title={doc.title}>
                {doc.title}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <Calendar size={12} />
                {new Date(doc.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              {editingId === doc.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    placeholder="Year"
                    className="w-20 p-1.5 text-xs rounded border border-gray-200"
                  />
                  <button onClick={() => handleSave(doc.id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-50 p-1.5 rounded">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${doc.year ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                    {doc.year ? `Year ${doc.year}` : "No Year"}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { setEditingId(doc.id); setEditYear(doc.year || ""); }}
                      className="text-gray-400 hover:text-orange-600 p-1.5 hover:bg-orange-50 rounded transition-colors"
                      title="Edit Year"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm("Are you sure you want to delete this PDF?")) {
                          await deleteDocument(doc.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                      title="Delete PDF"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
