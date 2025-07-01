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


export function executeQuery(query: string, values: any[]): Promise<any> {
 
  return new Promise((resolve, reject) => {
    pool.getConnection((err: Error | null, connection: PoolConnection) => {
      if (err) {
        console.error("Error getting connection from pool:", err);
        return reject(err);
      }

      connection.query(query, values, (queryErr: Error | null, result: any) => {
        //  console.log(query)
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


type QueryWithParams = {
  query: string;
  values: any[];
};

export const executeTransaction = (queries: QueryWithParams[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection: PoolConnection) => {
      if (err) {
        console.error('Error getting connection from pool:', err);
        return reject(err);
      }

      connection.beginTransaction(async (err) => {
        if (err) {
          connection.release();
          console.error('Transaction begin error:', err);
          return reject(err);
        }

        try {
          for (const { query, values } of queries) {
            await new Promise((res, rej) => {
              connection.query(query, values, (err, result) => {
                if (err) return rej(err);
                res(result);
              });
            });
          }

          connection.commit((err) => {
            connection.release();
            if (err) {
              console.error('Commit error:', err);
              return reject(err);
            }
            resolve(true); // Or return results if needed
          });
        } catch (error) {
          connection.rollback(() => {
            connection.release();
            console.error('Transaction rolled back due to error:', error);
            reject(error);
          });
        }
      });
    });
  });
};




module.exports = { executeQuery, executeTransaction};
