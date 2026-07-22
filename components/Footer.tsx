import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white/70 py-6 sm:py-8 text-center border-t border-stone-800">
      <div className="flex flex-col items-center gap-2 sm:gap-4 max-w-7xl mx-auto px-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-xl sm:text-2xl">ॐ</div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Hanuman Mandir, Darekarwadi</h3>
        <div className="flex gap-4 sm:gap-6 mt-1 text-xs sm:text-sm">
          <Link href="/expenses" className="hover:text-orange-400 transition-colors">Seva Record</Link>
          <Link href="#donation" className="hover:text-orange-400 transition-colors">Donate</Link>
          <Link href="/admin/login" className="hover:text-orange-400 transition-colors">Admin</Link>
        </div>
        <p className="text-[10px] sm:text-xs text-stone-500 mt-2 sm:mt-4">© {new Date().getFullYear()} Developed by Mayuresh Darekar.</p>
      </div>
    </footer>
  );
}
