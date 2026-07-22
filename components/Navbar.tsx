"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Info, Image as ImageIcon, Clock, Music, Calendar, Utensils, ShieldCheck, FileText } from "lucide-react";

const navLinks = [
  { href: "/#about", label: "About", icon: Info },
  { href: "/#gallery", label: "Gallery", icon: ImageIcon },
  { href: "/#timings", label: "Timings", icon: Clock },
  { href: "/#aarti", label: "Aarti", icon: Music },
  { href: "/#events", label: "Events", icon: Calendar },
  { href: "/mahaprasad", label: "Mahaprasad", icon: Utensils },
  { href: "/paharekari", label: "Paharekari", icon: ShieldCheck },
  { href: "/accounts", label: "Accounts", icon: FileText },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getLinkHref = (href: string) => {
    // If already on home page, use just the hash for smooth scroll
    if (pathname === "/" && href.startsWith("/#")) {
      return href.slice(1); // "#about" etc.
    }
    return href;
  };

  return (
    <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-6xl z-50 bg-white/90 backdrop-blur-md border border-orange-200 shadow-lg rounded-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-sm sm:text-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0">ॐ</div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base tracking-wide text-gray-900 whitespace-nowrap">Hanuman Mandir</span>
              <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">Darekarwadi</span>
            </div>
          </Link>

          <div className="hidden lg:flex gap-1 items-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={getLinkHref(l.href)}
                prefetch={true}
                className="px-2 py-2 text-sm text-gray-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg font-medium transition-all whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={getLinkHref("/#donation")}
              prefetch={true}
              className="ml-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg"
            >
              Donate ❤️
            </Link>
          </div>

          <button className="lg:hidden text-gray-700 p-2" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border border-orange-200/60 shadow-[0_20px_40px_rgb(0,0,0,0.12)] absolute top-[60px] sm:top-[72px] left-0 w-full py-4 px-6 flex flex-col gap-0 rounded-3xl mt-2 overflow-hidden">
          
          {/* Subtle Background Animation */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.15] animate-pulse"></div>
            <div className="absolute top-20 -left-10 w-32 h-32 bg-amber-400 rounded-full mix-blend-multiply filter blur-2xl opacity-[0.15] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-[40px] border-orange-300 rounded-full opacity-[0.05] animate-[spin_20s_linear_infinite] border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-orange-500 opacity-[0.03] select-none font-black flex items-center justify-center">ॐ</div>
          </div>

          <div className="relative z-10 flex flex-col gap-0">
            {navLinks.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                   key={l.href}
                   href={getLinkHref(l.href)}
                   prefetch={true}
                   onClick={() => setIsOpen(false)}
                   className="flex items-center gap-3 py-1.5 px-3 text-gray-800 hover:text-orange-600 hover:bg-orange-50/80 rounded-xl font-semibold text-[14px] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                    <Icon size={16} />
                  </div>
                  {l.label}
                </Link>
              );
            })}
            <div className="w-full h-[1px] bg-gray-100 my-2"></div>
            <Link
              href={getLinkHref("/#donation")}
              prefetch={true}
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white flex justify-center items-center py-3 px-4 rounded-xl font-bold text-[15px] shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
            >
              Donate ❤️
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
