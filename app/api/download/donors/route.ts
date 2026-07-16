import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const donors = await prisma.donor.findMany({
      orderBy: { date: "desc" },
    });

    if (donors.length === 0) {
      return new NextResponse("No data available", { status: 404 });
    }

    // Create CSV header
    const csvHeader = "Name,Amount,Date,Note\n";

    // Create CSV rows
    const csvRows = donors.map(donor => {
      // Escape fields that might contain commas
      const name = `"${donor.name.replace(/"/g, '""')}"`;
      const amount = donor.amount;
      const date = new Date(donor.date).toLocaleDateString("en-IN");
      const note = donor.note ? `"${donor.note.replace(/"/g, '""')}"` : "";

      return `${name},${amount},${date},${note}`;
    });

    const csvContent = "\uFEFF" + csvHeader + csvRows.join("\n");

    const response = new NextResponse(csvContent);
    response.headers.set("Content-Type", "text/csv; charset=utf-8");
    response.headers.set("Content-Disposition", 'attachment; filename="hanuman-mandir-donors.csv"');

    return response;
  } catch (error) {
    console.error("Failed to generate donors CSV:", error);
    return new NextResponse("Failed to generate CSV", { status: 500 });
  }
}
