import 'dotenv/config';
import { betterAuth } from 'better-auth';
import pg from 'pg';

const { Pool } = pg;

// In production, Render automatically sets RENDER_EXTERNAL_URL
const appURL =
  process.env.BETTER_AUTH_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  'http://localhost:3001';

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: appURL,
  trustedOrigins: [appURL, 'http://localhost:5173'],
});
