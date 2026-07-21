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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 bg-white/90 backdrop-blur-md border border-orange-200 shadow-lg rounded-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0">ॐ</div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-base tracking-wide text-gray-900 truncate">Hanuman Mandir</span>
              <span className="text-[10px] sm:text-xs text-gray-400 truncate">Darekarwadi</span>
            </div>
          </Link>

          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={getLinkHref(l.href)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg font-medium transition-all"
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

          <button className="md:hidden text-gray-700 p-2" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 shadow-xl absolute top-[72px] left-0 w-full py-4 px-6 flex flex-col gap-1 rounded-b-3xl">
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
