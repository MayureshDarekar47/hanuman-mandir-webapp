"use client";
import { motion } from "framer-motion";

export default function Map() {
  return (
    <section className="py-2 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="map" aria-label="Temple Location Map">
      <motion.header 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-2 sm:mb-12"
      >
        <p className="text-temple-saffron font-semibold tracking-wider uppercase mb-2">Google Map</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Temple Location</h2>
        <address className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-1 sm:mb-8 not-italic">
          Address: Hanuman Mandir, Darekarwadi, Dhavalpuri, Taluka Parner, Dist. Ahilyanagar, Maharashtra - 414103
        </address>
        
        <nav className="flex gap-4 justify-center" aria-label="Map Links">
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Hanuman%20Mandir%20Darekarwadi%20Dhavalpuri%20Parner%20Ahilyanagar%20Maharashtra%20414103" 
            target="_blank" 
            rel="noreferrer noopener"
            className="px-6 py-3 bg-temple-saffron hover:bg-temple-gold text-white font-semibold rounded-full transition-colors shadow-lg"
            aria-label="Open Temple Location in Google Maps"
          >
            Open in Maps
          </a>
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=Hanuman%20Mandir%20Darekarwadi%20Dhavalpuri%20Parner%20Ahilyanagar%20Maharashtra%20414103" 
            target="_blank" 
            rel="noreferrer noopener"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-full transition-colors shadow-sm"
            aria-label="Get Directions to Hanuman Mandir"
          >
            Get Directions
          </a>
        </nav>
      </motion.header>

      <motion.figure 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
      >
        <iframe 
          title="Interactive Google Map showing Hanuman Mandir Darekarwadi" 
          loading="lazy" 
          className="w-full h-full"
          src="https://www.google.com/maps?q=Hanuman%20Mandir%20Darekarwadi%20Dhavalpuri%20Parner%20Ahilyanagar%20Maharashtra%20414103&output=embed"
        />
      </motion.figure>
    </section>
  );
}
