const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.document.findMany({where:{type:'MAHAPRASAD'}}).then(console.log).finally(()=>p.$disconnect());
