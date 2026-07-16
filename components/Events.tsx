import { prisma } from "@/lib/db";
import { CalendarDays } from "lucide-react";
import EventCalendar from "./EventCalendar";

export default async function Events() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } }).catch(() => []);

  // Serialize events for client component
  const serialized = events.map(e => ({
    id: e.id,
    title: e.title,
    date: e.date.toISOString(),
    description: e.description ?? null,
  }));

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="events" aria-label="Temple Events and Festivals">
      <header className="text-center mb-12">
        <p className="text-orange-600 font-semibold tracking-wider uppercase mb-2">Temple Calendar</p>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <CalendarDays className="text-amber-500 flex-shrink-0" size={32} aria-hidden="true" /> Events &amp; Festivals
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-4">
          Browse our month-by-month calendar for upcoming village festivals and temple ceremonies. Days with events are marked with an orange dot — click to see details.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <EventCalendar events={serialized} />
        </div>

        {/* Upcoming events list */}
        <aside className="flex flex-col gap-4" aria-labelledby="upcoming-events-title">
          <h3 id="upcoming-events-title" className="text-xl font-bold text-gray-800">Upcoming Events</h3>
          {events.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {events.slice(0, 5).map(event => (
                <li key={event.id}>
                  <article className="flex gap-4 items-start bg-white rounded-2xl shadow border border-orange-100 p-4 hover:-translate-y-1 transition-transform">
                    <div className="flex-shrink-0 bg-orange-600 text-white rounded-xl px-3 py-2 text-center min-w-[56px]" aria-hidden="true">
                      <p className="text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="text-2xl font-black leading-tight">{new Date(event.date).getDate()}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{event.title}</h4>
                      {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 text-center text-gray-500">
              No upcoming events scheduled.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
