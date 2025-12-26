import { prisma } from '../src/utils/prisma.js';

async function main() {
  // Add your seed data here

  await prisma.user.create({
    data: {
      email: '125@qq.com',
      name: 'admin',
      password: '123123',
    },
  });

  await prisma.user.create({
    data: {
      email: '932@qq.com',
      name: 'user',
      password: '123123',
    },
  });

  await prisma.user.create({
    data: {
      email: '849529321@qq.com',
      name: 'wind',
      password: '123123',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
