import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const to12h = (time: string | null | undefined) => {
  if (!time) return "";
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
};

export async function GET() {
  try {
    const records = await prisma.paharekari.findMany({
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    const header = "Date,Name,Time Start,Time End";
    const rows = records.map((r) => {
      const date = r.date ? new Date(r.date).toLocaleDateString("en-IN") : "";
      const name = `"${r.name.replace(/"/g, '""')}"`;
      const start = to12h(r.startTime);
      const end = to12h(r.endTime);
      return `${date},${name},${start},${end}`;
    });

    const csv = [header, ...rows].join("\n");
    const fileName = `paharekari_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch {
    return new NextResponse("Error generating CSV", { status: 500 });
  }
}
