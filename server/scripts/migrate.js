import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// ── App tables ───────────────────────────────────────────────────────────────

await sql`
  CREATE TABLE IF NOT EXISTS courts (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    surface     TEXT NOT NULL,
    indoor      BOOLEAN NOT NULL,
    description TEXT
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS bookings (
    id          TEXT PRIMARY KEY,
    court_id    TEXT NOT NULL REFERENCES courts(id),
    court_name  TEXT NOT NULL,
    date        TEXT NOT NULL,
    slot_id     TEXT NOT NULL,
    slot_label  TEXT NOT NULL,
    player_name TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (court_id, date, slot_id)
  )
`;

// ── Better Auth tables (camelCase columns match the Kysely adapter) ───────────

await sql`
  CREATE TABLE IF NOT EXISTS "user" (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    email            TEXT NOT NULL UNIQUE,
    "emailVerified"  BOOLEAN NOT NULL DEFAULT FALSE,
    image            TEXT,
    "createdAt"      TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"      TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS session (
    id           TEXT PRIMARY KEY,
    "expiresAt"  TIMESTAMP NOT NULL,
    token        TEXT NOT NULL UNIQUE,
    "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "ipAddress"  TEXT,
    "userAgent"  TEXT,
    "userId"     TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS account (
    id                      TEXT PRIMARY KEY,
    "accountId"             TEXT NOT NULL,
    "providerId"            TEXT NOT NULL,
    "userId"                TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "accessToken"           TEXT,
    "refreshToken"          TEXT,
    "idToken"               TEXT,
    "accessTokenExpiresAt"  TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    scope                   TEXT,
    password                TEXT,
    "createdAt"             TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"             TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS verification (
    id          TEXT PRIMARY KEY,
    identifier  TEXT NOT NULL,
    value       TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP,
    "updatedAt" TIMESTAMP
  )
`;

// ── Additive schema changes (idempotent) ─────────────────────────────────────

await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES "user"(id)`;

// ── Seed courts ──────────────────────────────────────────────────────────────

const courts = [
  { id: 'court-1', name: 'Court 1 - Hardcourt', surface: 'Hard',  indoor: false, description: 'Full-size outdoor hardcourt with floodlights.' },
  { id: 'court-2', name: 'Court 2 - Clay',      surface: 'Clay',  indoor: false, description: 'Classic red clay court, ideal for baseline play.' },
  { id: 'court-3', name: 'Court 3 - Indoor',    surface: 'Hard',  indoor: true,  description: 'Heated indoor court available year-round.' },
  { id: 'court-4', name: 'Court 4 - Grass',     surface: 'Grass', indoor: false, description: 'Natural grass court for the authentic Wimbledon feel.' },
];

for (const c of courts) {
  await sql`
    INSERT INTO courts (id, name, surface, indoor, description)
    VALUES (${c.id}, ${c.name}, ${c.surface}, ${c.indoor}, ${c.description})
    ON CONFLICT (id) DO NOTHING
  `;
}

console.log('Migration complete.');
