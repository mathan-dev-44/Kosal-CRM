import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },

  max: 5,

  idleTimeoutMillis: 30000,

  connectionTimeoutMillis: 15000,
});

export default pool;
