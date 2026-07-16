import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });

    if (expenses.length === 0) {
      return new NextResponse("No data available", { status: 404 });
    }

    // Create CSV header
    const csvHeader = "Date,Category,Amount,Remark\n";

    // Create CSV rows
    const csvRows = expenses.map(expense => {
      // Escape fields that might contain commas
      const date = new Date(expense.date).toLocaleDateString("en-IN");
      const category = `"${expense.category.replace(/"/g, '""')}"`;
      const amount = expense.amount;
      const remark = expense.remark ? `"${expense.remark.replace(/"/g, '""')}"` : "";

      return `${date},${category},${amount},${remark}`;
    });

    const csvContent = "\uFEFF" + csvHeader + csvRows.join("\n");

    const response = new NextResponse(csvContent);
    response.headers.set("Content-Type", "text/csv; charset=utf-8");
    response.headers.set("Content-Disposition", 'attachment; filename="hanuman-mandir-seva-records.csv"');

    return response;
  } catch (error) {
    console.error("Failed to generate expenses CSV:", error);
    return new NextResponse("Failed to generate CSV", { status: 500 });
  }
}
