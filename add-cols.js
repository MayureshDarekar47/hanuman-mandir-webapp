const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Adding startTime column...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "MahaprasadItem" ADD COLUMN "startTime" TEXT`);
  } catch (e) {
    console.log("startTime already exists or error:", e.message);
  }

  try {
    console.log("Adding endTime column...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "MahaprasadItem" ADD COLUMN "endTime" TEXT`);
  } catch (e) {
    console.log("endTime already exists or error:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
