import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed default admin user (admin / 1234) only if no admin exists
  const existing = await prisma.adminUser.count();
  if (existing === 0) {
    const hash = await bcrypt.hash("1234", 10);
    await prisma.adminUser.create({
      data: {
        username: "admin",
        passwordHash: hash,
      },
    });
    console.log("✅ Default admin created: username=admin, password=1234");
    console.log("   ⚠️  Please change the password from the admin Settings page after first login.");
  } else {
    console.log("ℹ️  Admin user already exists. Skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
