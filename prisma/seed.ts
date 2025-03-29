import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);
  await Promise.all(
    Array.from({ length: 100 }).map((_, index) => {
      return prisma.user.create({
        data: {
          email: `user${index}.example@babilon.com`,
          fullName: 'User Example',
          username: `user.example.${index}`,
          normalizedName: `user.example.${index}`,
          password: hashedPassword,
          socialGraph: { create: { followers: [], following: [] } },
        },
      });
    }),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
