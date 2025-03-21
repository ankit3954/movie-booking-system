import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  connectionLimit: 10, // Maximum number of connections
});

// Promisify for async/await
const db = pool.promise();

export default db;
