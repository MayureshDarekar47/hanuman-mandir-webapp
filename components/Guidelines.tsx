import { prisma } from "@/lib/db";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export default async function Guidelines() {
  const rules = await prisma.guideline.findMany({ orderBy: { orderIndex: "asc" } }).catch(() => []);

  return (
    <section className="py-2 sm:py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="rules" aria-label="Visitor Guidelines">
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Left header */}
          <header className="pt-6 px-5 pb-2 md:p-14 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Visitor Guidelines
            </h2>
          </header>

          {/* Right rules grid */}
          <div className="lg:col-span-2 bg-white/5 pt-2 px-5 pb-6 md:p-14">
            {rules.length > 0 ? (
              <ul className="flex sm:grid sm:grid-cols-2 gap-4 overflow-x-auto pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex gap-3 items-start bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-colors w-[85vw] sm:w-auto flex-shrink-0 snap-center">
                    <CheckCircle2 className="text-amber-400 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                    <p className="text-white/90 text-sm leading-relaxed">{rule.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-white/40 text-center gap-3">
                <ShieldCheck size={40} aria-hidden="true" />
                <p className="font-medium text-sm">Guidelines will be added soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
