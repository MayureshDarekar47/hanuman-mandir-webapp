import { prisma } from "@/lib/db";
import AartiPlayer from "./AartiPlayer";
import { Music2 } from "lucide-react";

export default async function Aarti() {
  const dbAartis = await prisma.aarti.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []);

  const tracks = dbAartis.map(a => ({ id: a.id, title: a.title, subtitle: undefined, audioUrl: a.audioUrl }));

  if (tracks.length === 0) {
    return (
      <section className="py-2 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" id="aarti" aria-label="Aarti and Audio">
        <header className="text-center mb-2 sm:mb-12">
          {/* Removed superheader */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Aarti & Bhajans</h2>
        </header>
        <div className="flex flex-col items-center justify-center py-16 bg-orange-50 border border-orange-100 rounded-3xl text-center gap-4 text-gray-400">
          <Music2 size={48} className="text-orange-200" aria-hidden="true" />
          <p className="font-medium text-lg">No audio tracks uploaded yet.</p>
          <p className="text-sm">Visit the admin dashboard to upload Aarti audio.</p>
        </div>
      </section>
    );
  }

  return <AartiPlayer tracks={tracks} />;
}
