const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Paharekari" (
        "id" SERIAL NOT NULL,
        "date" TIMESTAMP(3),
        "name" TEXT NOT NULL,
        "startTime" TEXT,
        "endTime" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Paharekari_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log("Table 'Paharekari' created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
