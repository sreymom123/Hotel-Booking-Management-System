import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(backendRoot, ".env") });

const database = process.env.DB_NAME ?? "hotelbookingmanagementsystem";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  multipleStatements: false,
});

try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await connection.query(`USE \`${database}\``);
  await applyBookingCompatibilityFixes(connection);

  const sql = await readFile(path.join(backendRoot, "database.sql"), "utf8");
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await connection.query(statement);

    if (/^CREATE TABLE IF NOT EXISTS bookings\b/i.test(statement)) {
      await applyBookingCompatibilityFixes(connection);
    }
  }

  await applyBookingCompatibilityFixes(connection);

  console.log(`Database migration completed for ${database}.`);
} finally {
  await connection.end();
}

async function applyBookingCompatibilityFixes(connection) {
  const [tables] = await connection.query("SHOW TABLES LIKE 'bookings'");

  if (tables.length === 0) {
    return;
  }

  await connection.query("ALTER TABLE bookings MODIFY user_id BIGINT UNSIGNED NULL");

  try {
    await connection.query("ALTER TABLE bookings MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT");
  } catch (error) {
    console.warn(`Skipping bookings.id compatibility alter: ${error.message}`);
  }
}
