// lib/db.ts
import { Pool } from "pg";

declare global {
  // Allow global var across hot reloads
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

let pool: Pool;

if (!global.pgPool) {
  global.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Neon DB
  });
}

pool = global.pgPool;

export default pool;
