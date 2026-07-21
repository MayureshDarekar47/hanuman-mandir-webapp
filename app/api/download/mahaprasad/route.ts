import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.mahaprasadItem.findMany({
      orderBy: { orderIndex: "asc" }
    });

    const data = items.map(item => ({
      "Sr No": item.orderIndex,
      "Date": item.date ? item.date.toLocaleDateString("en-IN") : "",
      "Bhojan Name": item.name,
      "Description": item.description || "",
      // @ts-ignore
      "Start Time": item.startTime || "",
      // @ts-ignore
      "End Time": item.endTime || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(ws);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=mahaprasad_records.csv",
      },
    });
  } catch (error) {
    console.error("Error generating CSV:", error);
    return new NextResponse("Error generating CSV", { status: 500 });
  }
}
