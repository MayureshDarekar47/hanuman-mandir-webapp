import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { songs } = body;

    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return NextResponse.json({ error: "No songs provided" }, { status: 400 });
    }

    const results: { title: string; success: boolean; error?: string; url?: string }[] = [];
    let successCount = 0;

    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      
      if (!song.title || !song.audioUrl) {
        results.push({ title: song.title || `Song ${i + 1}`, success: false, error: "Missing title or audioUrl" });
        continue;
      }

      try {
        await prisma.aarti.create({
          data: {
            title: song.title.trim(),
            audioUrl: song.audioUrl,
            seoTitle: song.seoTitle || null,
            focusKeyword: song.focusKeyword || null,
            metaDescription: song.metaDescription || null,
            createdAt: new Date(Date.now() + i * 1000), // stagger so ordering works
          },
        });
        
        results.push({ title: song.title, success: true, url: song.audioUrl });
        successCount++;
      } catch (err: any) {
        results.push({ title: song.title, success: false, error: err?.message || "Database insert failed" });
      }
    }

    if (successCount > 0) {
      revalidatePath("/");
      revalidatePath("/admin/dashboard");
    }

    return NextResponse.json({
      success: successCount > 0,
      total: songs.length,
      uploaded: successCount,
      failed: songs.length - successCount,
      results,
    });

  } catch (err: any) {
    console.error("[aarti metadata save]", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
