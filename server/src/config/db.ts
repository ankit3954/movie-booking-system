import mysql, { Pool, PoolConnection, QueryError } from 'mysql2';
import dotenv from "dotenv";


dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


function executeQuery(query: string, values: any[]): Promise<any> {
  console.log(query)
  return new Promise((resolve, reject) => {
    pool.getConnection((err: Error | null, connection: PoolConnection) => {
      if (err) {
        console.error("Error getting connection from pool:", err);
        return reject(err);
      }

      connection.query(query, values, (queryErr: Error | null, result: any) => {
        connection.release(); // Ensure connection is released

        if (queryErr) {
          console.error("Error executing query:", queryErr);
          return reject(queryErr);
        }

        resolve(result);
      });
    });
  });
}



export default executeQuery;
