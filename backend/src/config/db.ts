import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "hotelbookingmanagementsystem",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  namedPlaceholders: true,
});

export default pool;
<<<<<<< HEAD
export const db = pool;
=======
export const db = pool;
>>>>>>> 01ecffbcf659f65de2522c5e7152b9c944e3b2c4
