const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Tạo wallet test
  const wallet = await prisma.wallet.upsert({
    where: { address: 'test-wallet-address' },
    update: {},
    create: {
      address: 'test-wallet-address',
    },
  });

  console.log('Created test wallet:', wallet);

  // Tạo user test liên kết với wallet
  const user = await prisma.user.upsert({
    where: { walletId: wallet.id },
    update: {},
    create: {
      walletId: wallet.id,
      name: 'Test User',
    },
  });

  console.log('Created test user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 