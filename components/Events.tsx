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
    <section className="py-2 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="events" aria-label="Temple Events and Festivals">
      <header className="text-center mb-2 sm:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <CalendarDays className="text-amber-500 flex-shrink-0" size={32} aria-hidden="true" /> Events &amp; Festivals
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-4">
          Annual Kirtan Days Celebration Schedule
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
            <ul className="flex overflow-x-auto lg:flex-col gap-4 pb-2 lg:pb-0 snap-x" style={{ scrollbarWidth: 'none' }}>
              {events.slice(0, 5).map(event => (
                <li key={event.id} className="min-w-[85vw] sm:min-w-[300px] lg:min-w-0 flex-shrink-0 snap-start">
                  <article className="flex gap-3 items-center bg-white rounded-xl shadow border border-orange-100 p-3 lg:p-3 hover:-translate-y-1 transition-transform h-full">
                    <div className="flex-shrink-0 bg-orange-600 text-white rounded-lg px-2 py-1 text-center min-w-[48px]" aria-hidden="true">
                      <p className="text-[10px] font-bold uppercase leading-none">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                      <p className="text-xl font-black leading-tight mt-0.5">{new Date(event.date).getDate()}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{event.title}</h4>
                      {event.description && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{event.description}</p>}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-orange-50 rounded-2xl border border-orange-100 py-3 px-4 text-center text-sm text-gray-500">
              No upcoming events scheduled.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
