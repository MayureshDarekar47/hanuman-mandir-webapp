import { ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const mainNavItems = [
  { href: "/admin/dashboard", label: "📊", text: "Dashboard" },
  { href: "/admin/dashboard#whatsapp-settings", label: "💬", text: "WhatsApp Settings" },
  { href: "/admin/dashboard#manage-donors", label: "❤️", text: "Manage Donors" },
  { href: "/admin/dashboard#manage-notices", label: "📢", text: "Manage Notices" },
  { href: "/admin/dashboard#manage-events", label: "📅", text: "Manage Events" },
  { href: "/admin/dashboard#manage-mahaprasad", label: "🍛", text: "Manage Mahaprasad" },
  { href: "/admin/dashboard#manage-seva-records", label: "📋", text: "Manage Seva Records" },
  { href: "/admin/dashboard#manage-balance", label: "💰", text: "Manage Balance" },
  { href: "/admin/dashboard#manage-gallery", label: "🖼️", text: "Manage Gallery" },
  { href: "/admin/dashboard#upi-payment-methods", label: "💳", text: "UPI Payment Methods" },
  { href: "/admin/dashboard#manage-visitor-guidelines", label: "📜", text: "Manage Guidelines" },
  { href: "/admin/dashboard#manage-temple-timings", label: "🕐", text: "Manage Timings" },
  { href: "/admin/dashboard#manage-aarti-audio", label: "🔔", text: "Manage Aarti & Audio" },
  { href: "/admin/dashboard#manage-paharekari", label: "🛡️", text: "Manage Paharekari" },
  { href: "/admin/dashboard#about-section-image", label: "📸", text: "About Section Image" },
  { href: "/admin/dashboard#hero-background-management", label: "🌄", text: "Hero Background" },
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

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  console.log("=== DASHBOARD LAYOUT SESSION CHECK ===", session);
  if (!session) {
    redirect("/admin/login");
  }

  const allMobileItems = [...mainNavItems, { href: "/admin/settings", label: "⚙️", text: "Settings" }, { href: "/", label: "🏠", text: "Back to Site" }];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col pt-16 sm:pt-20">
      {/* Mobile fixed header */}
      <div className="md:hidden fixed top-[64px] sm:top-[80px] left-0 w-full z-40 bg-white/95 backdrop-blur-sm shadow-sm flex flex-col">
        {/* Mobile top nav bar */}
        <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-sm">ॐ</div>
            <span className="font-bold text-gray-900 text-sm">Admin Panel</span>
          </div>
          <SignOutButton />
        </div>

        {/* Mobile nav tabs — horizontal scroll */}
        <nav className="border-b border-gray-100 px-4 py-2 flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
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
      </div>
      {/* Spacer for mobile fixed header */}
      <div className="md:hidden h-[100px] w-full flex-shrink-0" />

      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar spacer */}
        <div className="hidden md:block w-64 flex-shrink-0" />

        {/* Desktop sidebar (fixed) */}
        <aside className="hidden md:flex fixed top-[64px] sm:top-[80px] w-64 bg-white border-r border-gray-100 shadow-sm p-5 flex-col justify-between h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-y-auto z-40">
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
