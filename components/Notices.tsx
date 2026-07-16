import { prisma } from "@/lib/db";
import { Bell } from "lucide-react";

export default async function Notices() {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }).catch(() => []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" id="notice" aria-label="Notice Board Announcements">
      <header className="text-center mb-12">
        <p className="text-orange-600 font-semibold tracking-wider uppercase mb-2">Announcements</p>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Bell className="text-amber-500 flex-shrink-0" size={30} aria-hidden="true" /> Notice Board
        </h2>
      </header>

      <ul className="space-y-4">
        {notices.length > 0 ? (
          notices.map(n => (
            <li key={n.id}>
              <article className="p-5 bg-white border-l-4 border-l-orange-500 rounded-r-2xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-gray-900">{n.title}</h3>
                {n.subtitle && <p className="text-gray-600 mt-1">{n.subtitle}</p>}
                {n.date && <time dateTime={new Date(n.date).toISOString()} className="text-sm text-orange-500 mt-3 block">{new Date(n.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time>}
              </article>
            </li>
          ))
        ) : (
          <li className="text-center p-10 bg-orange-50 border border-orange-100 rounded-2xl text-gray-500" aria-live="polite">
            <Bell className="mx-auto mb-3 text-orange-300" size={40} aria-hidden="true" />
            <p className="font-medium">No new notices at this time.</p>
          </li>
        )}
      </ul>
    </section>
  );
}
