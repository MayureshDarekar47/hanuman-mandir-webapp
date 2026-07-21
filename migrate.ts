import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "MahaprasadItem" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "date" TIMESTAMP(3),
        "orderIndex" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MahaprasadItem_pkey" PRIMARY KEY ("id")
    );
  `);
  console.log("Table created successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
