// Seed script — run with `pnpm --filter api prisma:seed` (wraps `prisma db seed`).
// Safe to re-run: categories/products upsert on their slug, and the admin
// account is created once then just has its role re-asserted afterwards.
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createPgAdapter } from '../src/prisma/create-prisma-client';
import { auth } from '../src/auth/auth';

const prisma = new PrismaClient({ adapter: createPgAdapter() });

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@prescriptionlifelinepharmacy.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

const categories = [
  {
    slug: 'prescription',
    name: 'Prescription Medicines',
    description: 'Medicines dispensed against a valid prescription, checked by a licensed pharmacist.',
  },
  {
    slug: 'over-the-counter',
    name: 'Over-the-Counter',
    description: 'Pain relief, cold & flu, digestive health and other no-prescription essentials.',
  },
  {
    slug: 'vitamins-supplements',
    name: 'Vitamins & Supplements',
    description: 'Multivitamins, minerals and daily supplements.',
  },
  {
    slug: 'personal-care',
    name: 'Personal Care',
    description: 'Skincare, hygiene and everyday personal care essentials.',
  },
  {
    slug: 'cosmetics',
    name: 'Cosmetics',
    description: 'Beauty and cosmetic products.',
  },
];

const products = [
  {
    slug: 'panadol-extra-24-tablets',
    name: 'Panadol Extra — 24 Tablets',
    description: 'Fast-acting pain relief for headaches, backache and fever, combining paracetamol with caffeine.',
    categorySlug: 'over-the-counter',
    priceKobo: 120_000,
    stock: 250,
    requiresPrescription: false,
  },
  {
    slug: 'emzor-paracetamol-syrup-100ml',
    name: 'Emzor Paracetamol Syrup 100ml',
    description: "Children's paracetamol syrup for fever and mild pain relief.",
    categorySlug: 'over-the-counter',
    priceKobo: 85_000,
    stock: 180,
    requiresPrescription: false,
  },
  {
    slug: 'oral-rehydration-salts-5-pack',
    name: 'Oral Rehydration Salts (5 Pack)',
    description: 'WHO-formula rehydration salts for diarrhoea and dehydration.',
    categorySlug: 'over-the-counter',
    priceKobo: 100_000,
    stock: 200,
    requiresPrescription: false,
  },
  {
    slug: 'vitamin-c-1000mg-30-tablets',
    name: 'Vitamin C 1000mg — 30 Tablets',
    description: 'High-strength vitamin C to support everyday immune health.',
    categorySlug: 'vitamins-supplements',
    priceKobo: 250_000,
    stock: 150,
    requiresPrescription: false,
  },
  {
    slug: 'centrum-multivitamin-60-tablets',
    name: 'Centrum Multivitamin — 60 Tablets',
    description: 'Complete daily multivitamin and mineral supplement.',
    categorySlug: 'vitamins-supplements',
    priceKobo: 890_000,
    stock: 90,
    requiresPrescription: false,
  },
  {
    slug: 'amoxicillin-500mg-21-capsules',
    name: 'Amoxicillin 500mg Capsules (21s)',
    description: 'Penicillin-type antibiotic for a range of bacterial infections. Dispensed against a valid prescription.',
    categorySlug: 'prescription',
    priceKobo: 180_000,
    stock: 60,
    requiresPrescription: true,
  },
  {
    slug: 'metformin-500mg-tablets',
    name: 'Metformin 500mg Tablets',
    description: 'First-line oral medication for type 2 diabetes management.',
    categorySlug: 'prescription',
    priceKobo: 145_000,
    stock: 70,
    requiresPrescription: true,
  },
  {
    slug: 'nivea-body-lotion-400ml',
    name: 'Nivea Body Lotion 400ml',
    description: 'Everyday moisturising body lotion for normal to dry skin.',
    categorySlug: 'personal-care',
    priceKobo: 320_000,
    stock: 120,
    requiresPrescription: false,
  },
  {
    slug: 'digital-blood-pressure-monitor',
    name: 'Digital Blood Pressure Monitor',
    description: 'Automatic upper-arm blood pressure monitor for home use.',
    categorySlug: 'personal-care',
    priceKobo: 1_850_000,
    stock: 25,
    requiresPrescription: false,
  },
];

async function main() {
  console.log('Seeding categories...');
  const categoryIdBySlug = new Map<string, string>();
  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
    categoryIdBySlug.set(row.slug, row.id);
  }

  console.log('Seeding products...');
  for (const { categorySlug, ...product } of products) {
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      throw new Error(`Unknown category slug "${categorySlug}" for product "${product.slug}"`);
    }
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, categoryId },
      create: { ...product, categoryId },
    });
  }

  console.log(`Ensuring admin user (${ADMIN_EMAIL})...`);
  let adminUserId: string | undefined = (
    await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  )?.id;

  if (!adminUserId) {
    const result = await auth.api.signUpEmail({
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: 'Pharmacy Admin' },
    });
    adminUserId = result.user.id;
    console.log(`  created admin user with a fresh password (see SEED_ADMIN_PASSWORD env var)`);
  }

  await prisma.user.update({ where: { id: adminUserId }, data: { role: 'admin' } });

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
