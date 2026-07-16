import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

// Helper: parse CSV text into expense records
function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const dataLines = lines.slice(1); // skip header
  const records: { date: Date; category: string; amount: number; remark?: string }[] = [];
  for (const line of dataLines) {
    // Handle quoted fields
    const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(c =>
      c.trim().replace(/^"|"$/g, "")
    ) ?? line.split(",").map(c => c.trim());
    
    // Column order: Date (dd/mm/yyyy), Category, Amount, Remark
    const rawDate = cols[0];
    const category = cols[1];
    const amount = parseFloat(cols[2]);
    const remark = cols[3] || undefined;
    
    if (!category || isNaN(amount) || !rawDate) continue;
    let parsedDate: Date;
    if (rawDate.includes("/")) {
      const [d, m, y] = rawDate.split("/");
      parsedDate = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    } else {
      parsedDate = new Date(rawDate);
    }
    if (isNaN(parsedDate.getTime())) continue;
    records.push({ date: parsedDate, category, amount, remark });
  }
  return records;
}

// Helper: parse Excel buffer into expense records
function parseExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const records: { date: Date; category: string; amount: number; remark?: string }[] = [];
  // Skip first row (header)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Column order: Date (dd/mm/yyyy), Category, Amount, Remark
    const rawDate = row[0];
    const category = String(row[1] || "").trim();
    const amount = parseFloat(String(row[2] || "0"));
    const remark = row[3] ? String(row[3]).trim() : undefined;
    
    if (!category || isNaN(amount)) continue;
    let parsedDate: Date;
    if (rawDate instanceof Date) {
      parsedDate = rawDate;
    } else if (typeof rawDate === "string" && rawDate.includes("/")) {
      const [d, m, y] = rawDate.split("/");
      parsedDate = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    } else if (typeof rawDate === "number") {
      // Excel serial date
      parsedDate = XLSX.SSF.parse_date_code(rawDate) as unknown as Date;
      const dateInfo = XLSX.SSF.parse_date_code(rawDate);
      parsedDate = new Date(dateInfo.y, dateInfo.m - 1, dateInfo.d);
    } else {
      parsedDate = new Date(rawDate);
    }
    if (!parsedDate || isNaN(parsedDate.getTime())) continue;
    records.push({ date: parsedDate, category, amount, remark });
  }
  return records;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    // ── PDF: store in Supabase, return download URL ──────────────
    if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
      const bucketName = process.env.SUPABASE_BUCKET_NAME || "assets";
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `seva/${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, buffer, { contentType: "application/pdf", upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

      // Try basic text extraction for simple PDFs
      let parsedRecords: { date: Date; category: string; amount: number; remark?: string }[] = [];
      let pdfText = "";
      try {
        // pdf-parse is a CJS module — use require() to avoid ESM interop issues
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
        const parsed = await pdfParse(buffer);
        pdfText = parsed.text;
        // Try to parse as CSV-like text
        if (pdfText) {
          parsedRecords = parseCSV(pdfText);
        }
      } catch {
        // PDF is image-based or unreadable — that's fine, just offer download
      }

      const yearStr = formData.get("year") as string | null;
      const parsedYear = yearStr ? parseInt(yearStr) : null;

      if (parsedRecords.length > 0) {
        await prisma.expense.createMany({ data: parsedRecords });
        await prisma.document.create({
          data: { title: file.name, url: urlData.publicUrl, year: parsedYear, type: "SEVA" }
        });
        revalidatePath("/expenses");
        revalidatePath("/");
        return NextResponse.json({
          success: true,
          type: "pdf-parsed",
          count: parsedRecords.length,
          downloadUrl: urlData.publicUrl,
          message: `Parsed ${parsedRecords.length} seva records from PDF. File also stored for download.`,
        });
      }

      await prisma.document.create({
        data: { title: file.name, url: urlData.publicUrl, year: parsedYear, type: "SEVA" }
      });
      revalidatePath("/expenses");
      revalidatePath("/");
      return NextResponse.json({
        success: true,
        type: "pdf-download",
        count: 0,
        downloadUrl: urlData.publicUrl,
        message: "PDF stored for download. Could not auto-parse seva records (scanned/image PDF).",
      });
    }

    // ── Excel ─────────────────────────────────────────────────────
    if (
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls") ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      const records = parseExcel(buffer);
      if (records.length === 0) {
        return NextResponse.json({ error: "No valid rows found in Excel file. Check column format: Date (dd/mm/yyyy), Category, Amount, Remark" }, { status: 400 });
      }
      await prisma.expense.createMany({ data: records });
      revalidatePath("/expenses");
      revalidatePath("/");
      return NextResponse.json({
        success: true,
        type: "excel",
        count: records.length,
        message: `Successfully imported ${records.length} seva records from Excel.`,
        preview: records.slice(0, 5),
      });
    }

    // ── CSV ───────────────────────────────────────────────────────
    if (
      fileName.endsWith(".csv") ||
      file.type === "text/csv" ||
      file.type === "application/csv"
    ) {
      const text = buffer.toString("utf-8");
      const records = parseCSV(text);
      if (records.length === 0) {
        return NextResponse.json({ error: "No valid rows found in CSV. Check column format: Date (dd/mm/yyyy), Category, Amount, Remark" }, { status: 400 });
      }
      await prisma.expense.createMany({ data: records });
      revalidatePath("/expenses");
      revalidatePath("/");
      return NextResponse.json({
        success: true,
        type: "csv",
        count: records.length,
        message: `Successfully imported ${records.length} seva records from CSV.`,
        preview: records.slice(0, 5),
      });
    }

    return NextResponse.json({ error: "Unsupported file type. Please upload CSV, Excel (.xlsx), or PDF." }, { status: 400 });

  } catch (err: any) {
    console.error("[seva-file upload]", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
