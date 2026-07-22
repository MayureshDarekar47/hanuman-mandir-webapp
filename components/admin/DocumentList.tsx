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
    <div className="flex flex-wrap gap-3 items-center">
      {filteredDocs.map(doc => (
        <div key={doc.id} className="bg-white border border-gray-100 rounded-xl py-2 px-4 shadow-sm flex items-center gap-3">
          <FileText size={18} className="text-orange-500 flex-shrink-0" />
          
          <a href={doc.url} target="_blank" className="font-semibold text-gray-700 text-sm hover:text-orange-600 truncate max-w-[200px]" title={doc.title}>
            {doc.title}
          </a>

          <div className="w-[1px] h-5 bg-gray-200 mx-1"></div>

          {editingId === doc.id ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
                placeholder="Year"
                className="w-20 p-1.5 text-xs rounded-lg border border-gray-200"
              />
              <button onClick={() => handleSave(doc.id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors">
                <Check size={16} />
              </button>
              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${doc.year ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                {doc.year || "N/A"}
              </span>
              <button 
                onClick={() => { setEditingId(doc.id); setEditYear(doc.year || ""); }}
                className="text-gray-400 hover:text-orange-600 p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
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
                className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete PDF"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
