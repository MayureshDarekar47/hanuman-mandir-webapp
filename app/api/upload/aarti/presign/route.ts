import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFilename = `aarti-${Date.now()}-${Math.random().toString(36).slice(2)}_${safeName}`;
    const bucketName = process.env.SUPABASE_BUCKET_NAME || "assets";

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(uniqueFilename);

    if (error) {
      return NextResponse.json({ error: `Failed to create signed URL: ${error.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(uniqueFilename);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: urlData.publicUrl
    });

  } catch (err: any) {
    console.error("[aarti presign error]", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
