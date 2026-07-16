"use client";

import { useState, useMemo } from "react";
import { FileText, Calendar, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Doc = {
  id: number;
  title: string;
  url: string;
  year: number | null;
  createdAt: Date;
};

export default function PublicDocumentList({ documents, title }: { documents: Doc[], title: string }) {
  const [selectedYear, setSelectedYear] = useState<string>("All");

  const years = useMemo(() => {
    const y = new Set<string>();
    documents.forEach(d => y.add(d.year ? d.year.toString() : "Not Assigned"));
    return ["All", ...Array.from(y).sort((a, b) => b.localeCompare(a))];
  }, [documents]);

  const filteredDocs = useMemo(() => {
    let filtered = documents;
    if (selectedYear !== "All") {
      filtered = documents.filter(d => 
        (selectedYear === "Not Assigned" && d.year === null) || 
        (d.year?.toString() === selectedYear)
      );
    }
    // Sort by year desc, nulls last
    return filtered.sort((a, b) => {
      if (a.year === b.year) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (a.year === null) return 1;
      if (b.year === null) return -1;
      return b.year - a.year;
    });
  }, [documents, selectedYear]);

  if (documents.length === 0) return null;

  return (
    <section className="mb-16 mt-8" aria-label={`${title} Annual Reports`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title} Annual Reports</h2>
        
        {years.length > 2 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Filter Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {years.map(y => (
                <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredDocs.map(doc => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={doc.id}
              className="bg-white border border-orange-100 rounded-2xl p-5 shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10 transition-shadow flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <FileText size={24} />
                </div>
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${doc.year ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                  {doc.year ? `Year ${doc.year}` : "Year Not Assigned"}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">
                {doc.title}
              </h3>
              
              <div suppressHydrationWarning className="text-sm text-gray-500 flex items-center gap-2 mb-6 mt-auto">
                <Calendar size={14} className="text-gray-400" />
                Uploaded: {new Date(doc.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
              </div>
              
              <a 
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-orange-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                <Download size={16} />
                Download PDF
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredDocs.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No reports found for the selected year.
          </div>
        )}
      </div>
    </section>
  );
}
