import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite"
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  schema: './lib/schema.ts',
  migrations: {
    table: 'drizzle-migrations', // default `__drizzle_migrations`,
    schema: 'public' // used in PostgreSQL only and default to `drizzle`
  }
});
