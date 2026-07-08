const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  const siteSettings = await prisma.siteSettings.findFirst();
  const gallery = await prisma.galleryImage.findMany();
  console.log("SiteSettings:", siteSettings);
  console.log("Gallery:", gallery);
}

checkDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
