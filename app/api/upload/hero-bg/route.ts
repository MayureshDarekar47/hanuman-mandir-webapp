import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

async function deleteHeroBgRecord(id: number, url: string, mobileUrl?: string | null) {
  try {
    await prisma.heroBackground.delete({ where: { id } });
    const bucketName = process.env.SUPABASE_BUCKET_NAME || "assets";
    const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/`;
    const paths: string[] = [];
    if (url) paths.push(url.startsWith(prefix) ? url.replace(prefix, "") : url);
    if (mobileUrl) paths.push(mobileUrl.startsWith(prefix) ? mobileUrl.replace(prefix, "") : mobileUrl);
    if (paths.length > 0) await supabase.storage.from(bucketName).remove(paths);
  } catch (e) {
    console.error("Delete hero bg error", e);
  }
}

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
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `hero-${Date.now()}.${ext}`;
    const bucketName = process.env.SUPABASE_BUCKET_NAME || "assets";

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filename);

    await prisma.heroBackground.updateMany({ data: { isActive: false } });
    await prisma.heroBackground.create({
      data: { url: urlData.publicUrl, mobileUrl: urlData.publicUrl, isActive: true },
    });

    const allBgs = await prisma.heroBackground.findMany({ orderBy: { createdAt: "desc" } });
    if (allBgs.length > 6) {
      for (const bg of allBgs.slice(6)) {
        await deleteHeroBgRecord(bg.id, bg.url, bg.mobileUrl);
      }
    }

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (err: any) {
    console.error("[hero-bg upload]", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
