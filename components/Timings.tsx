import { prisma } from "@/lib/db";
import { Clock } from "lucide-react";

export default async function Timings() {
  const timings = await prisma.timing.findMany({ orderBy: { orderIndex: 'asc' } }).catch(() => []);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-[100vw] overflow-x-hidden sm:overflow-visible" id="timings" aria-label="Temple Timings">
      <header className="text-center mb-4 sm:mb-2 sm:mb-4">

        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Temple Timings</h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto"></p>
      </header>

      {timings.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {timings.map((t) => (
            <li key={t.id}>
              <article className="group p-4 sm:p-8 rounded-2xl bg-white shadow-lg border border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Clock className="text-orange-600 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <time className="text-orange-600 font-mono font-semibold text-xs sm:text-sm">{t.time}</time>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{t.title}</h3>
                {t.description && <p className="text-gray-500">{t.description}</p>}
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="max-w-4xl mx-auto text-center p-12 bg-orange-50 border border-orange-100 rounded-2xl text-gray-500">
          <Clock className="mx-auto mb-3 text-orange-300" size={40} aria-hidden="true" />
          <p className="font-medium">Temple timings will be updated soon.</p>
          <p className="text-sm mt-1 text-gray-400">Please contact the temple committee for current timings.</p>
        </div>
      )}
    </section>
  );
}
