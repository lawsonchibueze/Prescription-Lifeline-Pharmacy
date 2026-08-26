import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Prisma 7+ reads the database connection from this config file instead of
// `datasource.url` in schema.prisma. See https://pris.ly/d/config-datasource
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // ts-node is already a devDependency (from the Nest scaffold), so it's
    // reused here rather than adding tsx just for this one script.
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
