import { prisma } from "@/lib/db";
import { Clock } from "lucide-react";

export default async function Timings() {
  const timings = await prisma.timing.findMany({ orderBy: { orderIndex: 'asc' } }).catch(() => []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="timings" aria-label="Temple Timings">
      <header className="text-center mb-12">
        <p className="text-orange-600 font-semibold tracking-wider uppercase mb-2">Daily Schedule</p>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Temple Timings</h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our daily diya and aarti schedule for devotees</p>
      </header>

      {timings.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {timings.map((t) => (
            <li key={t.id}>
              <article className="group p-8 rounded-2xl bg-white shadow-lg border border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center" aria-hidden="true">
                    <Clock className="text-orange-600" size={20} />
                  </div>
                  <time className="text-orange-600 font-mono font-semibold text-sm">{t.time}</time>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h3>
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
