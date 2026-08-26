import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createPgAdapter } from '../prisma/create-prisma-client';

// Better Auth's Prisma adapter needs a plain PrismaClient (this file is also
// read directly by the `auth` CLI to generate/update the schema, outside of
// Nest's DI container, so it can't depend on PrismaService).
const prisma = new PrismaClient({ adapter: createPgAdapter() });

const trustedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',
  // Mounted explicitly under /api so it lines up with the rest of the API,
  // since Nest's global prefix doesn't apply to Better Auth's own
  // middleware-mounted routes.
  basePath: '/api/auth',
  trustedOrigins,
  user: {
    additionalFields: {
      // Admin API access (Phase 3). input: false means it can only ever be
      // set server-side (e.g. by the seed script) — never via sign-up/update
      // request bodies from a client.
      role: {
        type: 'string',
        input: false,
        defaultValue: 'customer',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    // TODO(phase 5+): require verification once a transactional email
    // provider (Resend/SendGrid/etc.) is wired up.
    requireEmailVerification: false,
    sendResetPassword: ({ user, url }) => {
      // TODO(phase 5+): replace with a real transactional email provider.
      // Logged for now so the reset flow is testable end-to-end in dev.
      console.log(`[auth] password reset requested for ${user.email}: ${url}`);
      return Promise.resolve();
    },
  },
});
