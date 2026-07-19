export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white/70 py-12 text-center border-t border-stone-800">
      <div className="flex flex-col items-center gap-4 max-w-7xl mx-auto px-4">
        <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-2xl">ॐ</div>
        <h3 className="text-xl font-bold text-white">Hanuman Mandir, Darekarwadi</h3>
        <p className="text-sm max-w-md text-center">Darekarwadi, Dhavalpuri, Taluka Parner, Dist. Ahilyanagar, Maharashtra - 414103</p>
        <div className="flex gap-6 mt-2 text-sm">
          <a href="/expenses" className="hover:text-orange-400 transition-colors">Seva Record</a>
          <a href="#donation" className="hover:text-orange-400 transition-colors">Donate</a>
          <a href="/admin/login" className="hover:text-orange-400 transition-colors">Admin</a>
        </div>
        <p className="text-xs text-stone-500 mt-4">© {new Date().getFullYear()} Developed by Mayuresh Darekar.</p>
      </div>
    </footer>
  );
}
