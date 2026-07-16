import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Collect all songs: song_0_title, song_0_subtitle, song_0_file, song_1_title, ...
    const results: { title: string; success: boolean; error?: string; url?: string }[] = [];

    let index = 0;
    while (true) {
      const title = formData.get(`song_${index}_title`) as string | null;
      const subtitle = formData.get(`song_${index}_subtitle`) as string | null;
      const file = formData.get(`song_${index}_file`) as File | null;

      // Stop when no more songs
      if (!title && !file) break;

      if (!title || !file || file.size === 0) {
        results.push({ title: title || `Song ${index + 1}`, success: false, error: "Missing title or audio file" });
        index++;
        continue;
      }

      if (file.size > 30 * 1024 * 1024) {
        results.push({ title, success: false, error: "File exceeds 30MB limit" });
        index++;
        continue;
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filename = `aarti-${Date.now()}-${index}_${safeName}`;
        const bucketName = process.env.SUPABASE_BUCKET_NAME || "assets";

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filename, buffer, { contentType: file.type || "audio/mpeg", upsert: false });

        if (uploadError) {
          results.push({ title, success: false, error: `Storage error: ${uploadError.message}` });
          index++;
          continue;
        }

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filename);

        await prisma.aarti.create({
          data: {
            title: title.trim(),
            audioUrl: urlData.publicUrl,
            createdAt: new Date(Date.now() + index * 1000), // stagger so ordering works
          },
        });

        results.push({ title, success: true, url: urlData.publicUrl });
      } catch (err: any) {
        results.push({ title, success: false, error: err?.message || "Upload failed" });
      }

      index++;
    }

    if (index === 0) {
      return NextResponse.json({ error: "No songs provided" }, { status: 400 });
    }

    const successCount = results.filter(r => r.success).length;
    
    if (successCount > 0) {
      revalidatePath("/");
      revalidatePath("/admin/dashboard");
    }

    return NextResponse.json({
      success: successCount > 0,
      total: index,
      uploaded: successCount,
      failed: index - successCount,
      results,
    });

  } catch (err: any) {
    console.error("[aarti multi-upload]", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
