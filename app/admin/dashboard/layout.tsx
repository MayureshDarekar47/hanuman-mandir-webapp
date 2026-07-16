import { ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const navItems = [
  { href: "/admin/dashboard", label: "📊 Dashboard" },
  { href: "/donors", label: "❤️ Donors" },
  { href: "/expenses", label: "📋 Seva Records" },
  { href: "/", label: "🏠 Back to Site" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col pt-16 sm:pt-20">
      {/* Mobile top nav bar */}
      <div className="md:hidden bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-sm">ॐ</div>
          <span className="font-bold text-gray-900 text-sm">Admin Panel</span>
        </div>
        <SignOutButton />
      </div>

      {/* Mobile nav tabs — horizontal scroll */}
      <nav className="md:hidden bg-white border-b border-gray-100 px-4 py-2 flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all whitespace-nowrap flex-shrink-0"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 shadow-sm p-6 flex-col justify-between sticky top-20 h-[calc(100vh-5rem)] flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-lg">ॐ</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Admin Panel</p>
                <p className="text-xs text-gray-400">Hanuman Mandir</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <SignOutButton />
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

