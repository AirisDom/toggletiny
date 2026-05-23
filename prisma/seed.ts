import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

const seedFlags = [
  {
    name: 'New Checkout Button',
    key: 'new-checkout-btn',
    description: 'Enables the redesigned checkout button with improved UX',
    isEnabled: true,
    environment: 'production' as const,
  },
  {
    name: 'New Checkout Button',
    key: 'new-checkout-btn',
    description: 'Enables the redesigned checkout button with improved UX',
    isEnabled: true,
    environment: 'development' as const,
  },
  {
    name: 'Beta Dashboard',
    key: 'beta-dashboard',
    description: 'Access to the new dashboard layout with analytics widgets',
    isEnabled: false,
    environment: 'production' as const,
  },
  {
    name: 'Beta Dashboard',
    key: 'beta-dashboard',
    description: 'Access to the new dashboard layout with analytics widgets',
    isEnabled: true,
    environment: 'development' as const,
  },
  {
    name: 'Dark Mode',
    key: 'dark-mode',
    description: 'Toggle dark mode theme across the application',
    isEnabled: true,
    environment: 'production' as const,
  },
  {
    name: 'Dark Mode',
    key: 'dark-mode',
    description: 'Toggle dark mode theme across the application',
    isEnabled: true,
    environment: 'development' as const,
  },
];

async function main() {
  console.log('Seeding feature flags...');

  for (const flag of seedFlags) {
    await prisma.featureFlag.upsert({
      where: {
        key_environment: {
          key: flag.key,
          environment: flag.environment,
        },
      },
      update: {},
      create: flag,
    });
  }

  const count = await prisma.featureFlag.count();
  console.log(`Seeding complete. Total flags: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
