"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#timings", label: "Timings" },
  { href: "/#aarti", label: "Aarti" },
  { href: "/#events", label: "Events" },
  { href: "/mahaprasad", label: "Mahaprasad" },
  { href: "/paharekari", label: "Paharekari" },
  { href: "/accounts", label: "Accounts" },
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
                className="px-2 py-2 text-sm text-gray-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg font-medium transition-all whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={getLinkHref("/#donation")}
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
        <div className="lg:hidden bg-white border-t border-orange-100 shadow-xl absolute top-[60px] sm:top-[72px] left-0 w-full py-4 px-6 flex flex-col gap-1 rounded-b-3xl">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={getLinkHref(l.href)}
              onClick={() => setIsOpen(false)}
              className="py-3 px-4 text-gray-700 hover:text-orange-700 hover:bg-orange-50 rounded-xl font-medium text-sm transition-all"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={getLinkHref("/#donation")}
            onClick={() => setIsOpen(false)}
            className="mt-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center py-3 px-4 rounded-xl font-semibold text-sm"
          >
            Donate ❤️
          </Link>
        </div>
      )}
    </nav>
  );
}
