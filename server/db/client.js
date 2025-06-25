import pg from "pg";

const isProduction = process.env.NODE_ENV === "production";

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false, // ← only use SSL in production
});

export default db;
