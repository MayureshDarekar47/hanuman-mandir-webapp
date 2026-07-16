const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  try {
    const settings = await prisma.siteSettings.findMany();
    console.log("Settings rows:", settings.length);
    console.dir(settings, { depth: null });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
