require("dotenv").config({path: ".env"});
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const site = await prisma.siteSettings.findFirst();
  console.log("DB WhatsApp Enabled:", site?.isWhatsappEnabled);
}
main().finally(() => prisma.$disconnect());
