"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const info = [
  { label: "Temple Name", value: "Hanuman Mandir" },
  { label: "Village", value: "Darekarwadi, Dhavalpuri" },
  { label: "Taluka", value: "Parner" },
  { label: "District", value: "Ahilyanagar" },
  { label: "State", value: "Maharashtra" },
  { label: "Pin Code", value: "414103" },
];

export default function About({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="about" aria-label="About the Temple">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text side */}
        <motion.article
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <header>
            <p className="text-orange-600 font-semibold tracking-wider uppercase mb-2 text-sm">About Temple</p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              A Sacred Place of<br />
              <span className="text-orange-600">Devotion &amp; Community</span>
            </h2>
          </header>
          <p className="text-gray-500 mb-8 text-base sm:text-lg leading-relaxed">
            Hanuman Mandir at Darekarwadi is the spiritual heart of our village. Dedicated to Lord Hanuman, it has been a place of daily prayers, community gatherings, and festivals for generations of devotees.
          </p>

          <aside className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4" aria-label="Temple Details">
            {info.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-orange-50 border border-orange-100 rounded-2xl p-3 sm:p-4"
              >
                <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base">{item.value}</p>
              </motion.div>
            ))}
          </aside>
        </motion.article>

        {/* Image side */}
        <motion.figure
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mt-8 lg:mt-0"
        >
          <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-orange-100 z-0" aria-hidden="true" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-64 sm:h-80 lg:h-[480px] z-10 w-full bg-[#0f0805]/5">
            {imageUrl ? (
              /* Dynamic Supabase image — use native img tag to bypass Next.js hostname restrictions */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Hanuman Mandir Darekarwadi Temple View"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              /* Static local asset — can safely use Next.js Image */
              <Image
                src="/assets/temple_04.jpg"
                alt="Hanuman Mandir Darekarwadi Temple View"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain hover:scale-105 transition-transform duration-700"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
              />
            )}
          </div>
          {/* Badge */}
          <figcaption className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 z-20 bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-orange-100 text-center">
            <p className="text-3xl font-black text-orange-600" aria-hidden="true">ॐ</p>
            <p className="text-xs font-bold text-gray-500 mt-1">जय बजरंग बली</p>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
