import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: 'zenchill@example.com',
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
    },
  });

  console.log('User details:', user);

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
