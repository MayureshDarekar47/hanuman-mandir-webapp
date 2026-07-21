import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

// Helper: parse CSV text into mahaprasad records
function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const dataLines = lines.slice(1); // skip header
  const records: { orderIndex: number; date?: Date; name: string; description?: string; startTime?: string; endTime?: string }[] = [];
  
  for (const line of dataLines) {
    const cols = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(c =>
      c.trim().replace(/^"|"$/g, "")
    ) ?? line.split(",").map(c => c.trim());
    
    // SrNo, Date, Bhojan Name, Description, Start Time, End Time
    const orderIndex = parseInt(cols[0]) || 0;
    const rawDate = cols[1];
    const name = cols[2];
    const description = cols[3] || undefined;
    const startTime = cols[4] || undefined;
    const endTime = cols[5] || undefined;
    
    if (!name) continue;
    
    let parsedDate: Date | undefined;
    if (rawDate) {
      if (rawDate.includes("/")) {
        const [d, m, y] = rawDate.split("/");
        parsedDate = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
      } else {
        parsedDate = new Date(rawDate);
      }
      if (isNaN(parsedDate.getTime())) parsedDate = undefined;
    }
    
    records.push({ orderIndex, date: parsedDate, name, description, startTime, endTime });
  }
  return records;
}

// Helper: parse Excel buffer into mahaprasad records
function parseExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  
  const dataRows = rows.slice(1);
  const records: { orderIndex: number; date?: Date; name: string; description?: string; startTime?: string; endTime?: string }[] = [];
  
  for (const row of dataRows) {
    if (!row[2]) continue; // name is required (index 2)
    
    let parsedDate: Date | undefined;
    if (row[1]) {
      if (row[1] instanceof Date) {
        parsedDate = row[1];
      } else {
        const rawDate = String(row[1]);
        if (rawDate.includes("/")) {
          const [d, m, y] = rawDate.split("/");
          parsedDate = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
        } else {
          parsedDate = new Date(rawDate);
        }
        if (isNaN(parsedDate.getTime())) parsedDate = undefined;
      }
    }

    records.push({
      orderIndex: parseInt(row[0]) || 0,
      date: parsedDate,
      name: String(row[2]).trim(),
      description: row[3] ? String(row[3]).trim() : undefined,
      startTime: row[4] ? String(row[4]).trim() : undefined,
      endTime: row[5] ? String(row[5]).trim() : undefined,
    });
  }
  return records;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const yearStr = formData.get("year") as string;
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let records: { date?: Date; name: string; description?: string; orderIndex: number }[] = [];
    let isPdf = false;
    let downloadUrl = null;

    if (file.name.endsWith(".csv")) {
      records = parseCSV(buffer.toString("utf-8"));
    } else if (file.name.match(/\.xlsx?$/)) {
      records = parseExcel(buffer);
    } else if (file.name.endsWith(".pdf")) {
      isPdf = true;
      // 1. Upload PDF to Supabase
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filename = `${Date.now()}_${safeName}`;
      const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(`documents/${filename}`, buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) {
        console.error("PDF Upload Error:", uploadError);
        return NextResponse.json({ success: false, error: "Failed to upload PDF to storage" }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`documents/${filename}`);
        
      downloadUrl = publicUrlData.publicUrl;

      // 2. Create Document record
      await prisma.document.create({
        data: {
          title: file.name,
          url: downloadUrl,
          year: parseInt(yearStr) || new Date().getFullYear(),
          type: "MAHAPRASAD",
        }
      });

      // 3. Try to extract records from PDF
      // records = await parsePDF(buffer); - removed as we don't parse pdf for mahaprasad
    } else {
      return NextResponse.json({ success: false, error: "Unsupported file format" }, { status: 400 });
    }

    // Insert extracted records (if any)
    let insertedCount = 0;
    if (records.length > 0) {
      // Chunk inserts to avoid query limits
      const CHUNK_SIZE = 100;
      for (let i = 0; i < records.length; i += CHUNK_SIZE) {
        const chunk = records.slice(i, i + CHUNK_SIZE);
        await prisma.mahaprasadItem.createMany({
          data: chunk,
          skipDuplicates: true,
        });
        insertedCount += chunk.length;
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath("/mahaprasad");

    return NextResponse.json({ 
      success: true, 
      count: insertedCount,
      message: isPdf 
        ? `PDF uploaded successfully! ${insertedCount > 0 ? `Also extracted ${insertedCount} records.` : ''}`
        : `Successfully imported ${insertedCount} records.`,
      preview: records.slice(0, 5), // Return first 5 records for preview
      downloadUrl
    });

  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
