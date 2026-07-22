import { prisma } from "@/lib/db";
import { Utensils, Calendar, Download, Clock } from "lucide-react";
import PublicDocumentList from "./PublicDocumentList";

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

export default async function Mahaprasad() {
  const [items, documents] = await Promise.all([
    prisma.mahaprasadItem.findMany({ orderBy: { orderIndex: "asc" } }).catch(() => []),
    prisma.document.findMany({ where: { type: "MAHAPRASAD" }, orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);

  if (items.length === 0 && documents.length === 0) return null;

  return (
    <section id="mahaprasad" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative overflow-hidden scroll-mt-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Top actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 sm:mb-8 gap-4 z-10 relative">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-orange-200">
          <Utensils size={16} /> Mahaprasad
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href="/api/download/mahaprasad"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Download size={16} />
            Download CSV
          </a>
        </div>
      </div>

      <div className="text-center mb-2 sm:mb-12 relative">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Today's <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Bhojan</span>
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
          Join us for the divine Mahaprasad served at the temple. Everyone is welcome to partake in the blessings.
        </p>
      </div>

      {documents.length > 0 && (
        <div className="mb-16">
          <PublicDocumentList documents={documents as any[]} title="Mahaprasad" />
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100 flex flex-col md:flex-row gap-4 md:items-center relative overflow-hidden"
          >
            {/* Sr No Tag */}
            <div className="absolute top-0 left-0 bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-1 rounded-br-lg z-10">
              #{item.orderIndex || index + 1}
            </div>

            <div className="flex-shrink-0 flex flex-col gap-2 mt-4 md:mt-0">
              {item.date && (
                <div className="flex items-center gap-1.5 text-sm font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 whitespace-nowrap">
                  <Calendar size={14} />
                  {new Date(item.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </div>
              )}
              {/* @ts-ignore */}
              {(item.startTime || item.endTime) && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 whitespace-nowrap">
                  <Clock size={14} />
                  {/* @ts-ignore */}
                  {formatTime12h(item.startTime)} - {formatTime12h(item.endTime)}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 md:ml-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                {item.name}
              </h3>
              
              {item.description && (
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
