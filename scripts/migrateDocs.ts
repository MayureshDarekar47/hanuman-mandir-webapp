import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Migrating SiteSettings PDFs to Document model...");
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    console.log("No SiteSettings found, nothing to migrate.");
    return;
  }

  let count = 0;

  if ((settings as any).donorsPdfUrl) {
    const existing = await prisma.document.findFirst({
      where: { url: (settings as any).donorsPdfUrl }
    });
    if (!existing) {
      await prisma.document.create({
        data: {
          title: "Donors Report (Legacy)",
          url: (settings as any).donorsPdfUrl,
          type: "DONOR",
          year: null, // "Year Not Assigned"
        }
      });
      console.log("Migrated Donors PDF.");
      count++;
    }
  }

  if ((settings as any).sevaPdfUrl) {
    const existing = await prisma.document.findFirst({
      where: { url: (settings as any).sevaPdfUrl }
    });
    if (!existing) {
      await prisma.document.create({
        data: {
          title: "Seva Records Report (Legacy)",
          url: (settings as any).sevaPdfUrl,
          type: "SEVA",
          year: null, // "Year Not Assigned"
        }
      });
      console.log("Migrated Seva PDF.");
      count++;
    }
  }

  console.log(`Migration complete. Migrated ${count} records.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
