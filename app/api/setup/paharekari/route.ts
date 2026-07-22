import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Create the Paharekari table if it doesn't exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Paharekari" (
        "id"        SERIAL        NOT NULL,
        "date"      TIMESTAMP(3),
        "name"      TEXT          NOT NULL,
        "startTime" TEXT,
        "endTime"   TEXT,
        "createdAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Paharekari_pkey" PRIMARY KEY ("id")
      );
    `);

    // Verify it works
    const count = await prisma.paharekari.count();

    return NextResponse.json({
      success: true,
      message: `Paharekari table created/verified successfully! Current records: ${count}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Setup failed" },
      { status: 500 }
    );
  }
}
