import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma 7 dropped the zero-config `new PrismaClient()` that read
// DATABASE_URL automatically — a driver adapter is now required everywhere
// a client is constructed. This is shared by PrismaService (used inside
// Nest's DI) and auth.ts (which the `auth` CLI also imports directly,
// outside of Nest, so it can't depend on ConfigModule having run yet).
export function createPgAdapter() {
  return new PrismaPg({ connectionString: process.env.DATABASE_URL });
}
