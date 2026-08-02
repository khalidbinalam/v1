import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL) as string,
  },
});
