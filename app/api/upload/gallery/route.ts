import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const bucketName = process.env.SUPABASE_BUCKET_NAME || "assets";

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`gallery/${filename}`, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(`gallery/${filename}`);

    await prisma.galleryImage.create({
      data: { url: urlData.publicUrl, altText: file.name },
    });

    return NextResponse.json({ success: true, url: urlData.publicUrl });

  } catch (err: any) {
    console.error("[gallery upload]", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
