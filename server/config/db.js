// config/db.js
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import "dotenv/config";

const pool = mysql.createPool({
  host:     process.env.DB_HOST    || "localhost",
  user:     process.env.DB_USER    || "root",
  password: process.env.DB_PASS    || "123456",
  database: process.env.DB_NAME    || "ecommerce",
});

export const db = drizzle(pool);
