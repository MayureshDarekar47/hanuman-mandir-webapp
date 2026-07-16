import { ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const mainNavItems = [
  { href: "/admin/dashboard", label: "📊", text: "Dashboard" },
  { href: "/admin/payments", label: "💳", text: "Payment & QR" },
  { href: "/donors", label: "❤️", text: "Donors" },
  { href: "/expenses", label: "📋", text: "Seva Records" },
];

const sectionNavItems = [
  { href: "/#donation", label: "🪙", text: "Donation Section" },
  { href: "/#gallery", label: "🖼️", text: "Gallery" },
  { href: "/#timings", label: "🕐", text: "Timings" },
  { href: "/#aarti", label: "🔔", text: "Aarti" },
  { href: "/#events", label: "📅", text: "Events" },
  { href: "/#notices", label: "📢", text: "Notices" },
  { href: "/#guidelines", label: "📜", text: "Guidelines" },
];

const bottomNavItems = [
  { href: "/admin/settings", label: "⚙️", text: "Settings" },
  { href: "/", label: "🏠", text: "Back to Site" },
];

const NavLink = ({ href, label, text, mobile = false }: { href: string; label: string; text: string; mobile?: boolean }) => (
  <Link
    href={href}
    className={
      mobile
        ? "px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all whitespace-nowrap flex-shrink-0"
        : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all"
    }
  >
    <span>{label}</span>
    <span>{text}</span>
  </Link>
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  const allMobileItems = [...mainNavItems, { href: "/admin/settings", label: "⚙️", text: "Settings" }, { href: "/", label: "🏠", text: "Back to Site" }];

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
        {allMobileItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
          >
            {item.label} {item.text}
          </Link>
        ))}
      </nav>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 shadow-sm p-5 flex-col justify-between sticky top-20 h-[calc(100vh-5rem)] flex-shrink-0 overflow-y-auto">
          {/* Top: logo */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-lg">ॐ</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Admin Panel</p>
                <p className="text-xs text-gray-400">Hanuman Mandir</p>
              </div>
            </div>

            {/* Main nav */}
            <nav className="flex flex-col gap-1 mb-4">
              {mainNavItems.map(item => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>

            {/* Section links */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
                Website Sections
              </p>
              <nav className="flex flex-col gap-0.5">
                {sectionNavItems.map(item => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom: Settings + Sign out */}
          <div className="border-t border-gray-100 pt-4 space-y-1">
            {bottomNavItems.map(item => (
              <NavLink key={item.href} {...item} />
            ))}
            <div className="pt-2">
              <SignOutButton />
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
