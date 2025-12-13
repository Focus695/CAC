import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: {
      email: 'zenchill@example.com',
    },
    data: {
      role: 'ADMIN',
    },
  });

  console.log('User role updated to ADMIN successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
