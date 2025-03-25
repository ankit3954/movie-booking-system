import express from "express";
import cors from "cors";
import pool from "./config/db";
import { AppError } from "./utils/AppError";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import { sendResponse } from "./utils/responseHandler";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/ping", async (req, res, next) => {
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    const [rows] = await connection.query("SELECT 1+1 AS result");
    connection.release(); // Release the connection back to the pool

    sendResponse(res, 200, rows)

    // res.json({ success: true, data: rows });
  } catch (error) {
    next(new AppError("DB Connection Failed", 500))
    // console.error("Database Error:", error);
    // res.status(500).json({ success: false, message: "DB Connection Failed" });
  }
});

// Global error handler middleware
app.use(globalErrorHandler);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
