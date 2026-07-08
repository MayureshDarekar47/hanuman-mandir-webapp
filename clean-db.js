const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanBrokenMedia() {
  console.log("Cleaning up database records that point to missing media...");
  
  // These tables reference media that was lost/not uploaded to the new Supabase bucket
  await prisma.galleryImage.deleteMany();
  await prisma.heroBackground.deleteMany();
  await prisma.aarti.deleteMany();
  
  console.log("✅ Cleared Gallery, Hero Background, and Aarti records.");
}

cleanBrokenMedia()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
