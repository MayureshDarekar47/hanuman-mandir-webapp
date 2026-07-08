import { ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const navItems = [
  { href: "/admin/dashboard", label: "📊 Dashboard" },
  { href: "/donors", label: "❤️ Donors (Public)" },
  { href: "/expenses", label: "📋 Seva Records (Public)" },
  { href: "/", label: "🏠 Back to Site" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row pt-20">
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 shadow-sm p-6 flex flex-col justify-between md:sticky md:top-20 md:h-[calc(100vh-5rem)]">
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
