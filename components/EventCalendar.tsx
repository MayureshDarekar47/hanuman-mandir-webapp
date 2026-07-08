"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Event = {
  id: number;
  title: string;
  date: string;
  description: string | null;
};

export default function EventCalendar({ events }: { events: Event[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Event[] | null>(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Map events to day numbers for current month/year
  const eventsByDay: Record<number, Event[]> = {};
  events.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(e);
    }
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelected(null);
  };

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allCells = [...blanks, ...days];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/20 transition">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h3 className="text-2xl font-bold tracking-wide">{monthNames[viewMonth]}</h3>
          <p className="text-white/80 text-sm">{viewYear}</p>
        </div>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/20 transition">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Day names row */}
      <div className="grid grid-cols-7 border-b border-orange-100">
        {dayNames.map(d => (
          <div key={d} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {allCells.map((day, idx) => {
          if (!day) return <div key={`blank-${idx}`} className="h-16 border-b border-r border-gray-50" />;
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          const hasEvents = !!eventsByDay[day];
          return (
            <button
              key={day}
              onClick={() => hasEvents ? setSelected(eventsByDay[day]) : setSelected(null)}
              className={`h-16 flex flex-col items-center justify-center gap-1 border-b border-r border-gray-50 transition-all relative
                ${isToday ? "bg-orange-50" : "hover:bg-amber-50"}
                ${hasEvents ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                ${isToday ? "bg-orange-600 text-white" : "text-gray-700"}`}>
                {day}
              </span>
              {hasEvents && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selected && selected.length > 0 && (
        <div className="p-6 border-t border-orange-100 bg-orange-50/50">
          <h4 className="font-bold text-orange-700 mb-3">Events on {new Date(selected[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}:</h4>
          <div className="space-y-2">
            {selected.map(e => (
              <div key={e.id} className="p-3 bg-white rounded-xl border border-orange-100 shadow-sm">
                <p className="font-bold text-gray-900">{e.title}</p>
                {e.description && <p className="text-sm text-gray-500 mt-1">{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
