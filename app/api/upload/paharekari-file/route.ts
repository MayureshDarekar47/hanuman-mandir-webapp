import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

type PaharekariRecord = {
  date: Date | null;
  name: string;
  startTime: string | null;
  endTime: string | null;
};

// Helper: parse CSV text into Paharekari records
function parseCSV(text: string): PaharekariRecord[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const dataLines = lines.slice(1); // skip header
  const records: PaharekariRecord[] = [];

  for (const line of dataLines) {
    const cols =
      line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map((c) =>
        c.trim().replace(/^"|"$/g, "")
      ) ?? line.split(",").map((c) => c.trim());

    const rawDate = cols[0];
    const name = cols[1];
    const startTime = cols[2] || null;
    const endTime = cols[3] || null;

    if (!name) continue;

    let parsedDate: Date | null = null;
    if (rawDate) {
      if (rawDate.includes("/")) {
        const [d, m, y] = rawDate.split("/");
        parsedDate = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      } else {
        parsedDate = new Date(rawDate);
      }
      if (isNaN(parsedDate.getTime())) parsedDate = null;
    }

    records.push({ date: parsedDate, name, startTime, endTime });
  }
  return records;
}

// Helper: parse Excel buffer into Paharekari records
function parseExcel(buffer: Buffer): PaharekariRecord[] {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const records: PaharekariRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rawDate = row[0];
    const name = String(row[1] || "").trim();
    const startTime = row[2] ? String(row[2]).trim() : null;
    const endTime = row[3] ? String(row[3]).trim() : null;

    if (!name) continue;

    let parsedDate: Date | null = null;
    if (rawDate) {
      if (rawDate instanceof Date) {
        parsedDate = rawDate;
      } else if (typeof rawDate === "string" && rawDate.includes("/")) {
        const [d, m, y] = rawDate.split("/");
        parsedDate = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      } else if (typeof rawDate === "number") {
        const dateInfo = XLSX.SSF.parse_date_code(rawDate);
        parsedDate = new Date(dateInfo.y, dateInfo.m - 1, dateInfo.d);
      } else {
        parsedDate = new Date(rawDate);
      }
      if (parsedDate && isNaN(parsedDate.getTime())) parsedDate = null;
    }

    records.push({ date: parsedDate, name, startTime, endTime });
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

    // ── PDF: Always store in Supabase first, then try to parse records ──
    if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
      const bucketName = process.env.SUPABASE_BUCKET_NAME || "assets";
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `paharekari/${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, buffer, { contentType: "application/pdf", upsert: false });

      if (uploadError) {
        return NextResponse.json(
          { error: `Storage upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
      const publicUrl = urlData.publicUrl;

      // Save to Document table for public download
      try {
        await prisma.document.create({
          data: {
            title: file.name,
            url: publicUrl,
            year: new Date().getFullYear(),
            type: "PAHAREKARI",
          },
        });
      } catch (docErr) {
        console.error("[paharekari-file] Document save failed:", docErr);
      }

      // Try to parse records from PDF text (optional, graceful fail)
      let parsedCount = 0;
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
        const parsed = await pdfParse(buffer);
        if (parsed.text) {
          const records = parseCSV(parsed.text);
          if (records.length > 0) {
            try {
              await prisma.paharekari.createMany({ data: records });
              parsedCount = records.length;
            } catch {
              // Table might not exist yet — PDF is still saved, records skipped
            }
          }
        }
      } catch {
        // PDF is image-based or unreadable — just offer download
      }

      revalidatePath("/admin/dashboard");
      revalidatePath("/paharekari");

      return NextResponse.json({
        success: true,
        type: "pdf",
        count: parsedCount,
        downloadUrl: publicUrl,
        message: parsedCount > 0
          ? `PDF stored for download and ${parsedCount} records imported automatically.`
          : "PDF successfully saved! Users can now download it from the Paharekari page.",
      });
    }

    // ── Excel ────────────────────────────────────────────────────────────
    if (
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls") ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      const records = parseExcel(buffer);
      if (records.length === 0) {
        return NextResponse.json(
          { error: "No valid rows found. Check columns: Date (dd/mm/yyyy), Name, Time Start, Time End" },
          { status: 400 }
        );
      }
      try {
        await prisma.paharekari.createMany({ data: records });
      } catch (err: any) {
        if (err?.code === "P2021") {
          return NextResponse.json(
            { error: "Database table not ready yet. Please ask the admin to create the Paharekari table in Supabase." },
            { status: 500 }
          );
        }
        throw err;
      }
      revalidatePath("/paharekari");
      revalidatePath("/admin/dashboard");
      return NextResponse.json({
        success: true,
        type: "excel",
        count: records.length,
        message: `Successfully imported ${records.length} Paharekari records from Excel.`,
        preview: records.slice(0, 5),
      });
    }

    // ── CSV ───────────────────────────────────────────────────────────────
    if (
      fileName.endsWith(".csv") ||
      file.type === "text/csv" ||
      file.type === "application/csv"
    ) {
      const text = buffer.toString("utf-8");
      const records = parseCSV(text);
      if (records.length === 0) {
        return NextResponse.json(
          { error: "No valid rows found. Check columns: Date (dd/mm/yyyy), Name, Time Start, Time End" },
          { status: 400 }
        );
      }
      try {
        await prisma.paharekari.createMany({ data: records });
      } catch (err: any) {
        if (err?.code === "P2021") {
          return NextResponse.json(
            { error: "Database table not ready yet. Please ask the admin to create the Paharekari table in Supabase." },
            { status: 500 }
          );
        }
        throw err;
      }
      revalidatePath("/paharekari");
      revalidatePath("/admin/dashboard");
      return NextResponse.json({
        success: true,
        type: "csv",
        count: records.length,
        message: `Successfully imported ${records.length} Paharekari records from CSV.`,
        preview: records.slice(0, 5),
      });
    }

    return NextResponse.json(
      { error: "Unsupported file type. Please upload CSV, Excel (.xlsx), or PDF." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("[paharekari-file upload]", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
