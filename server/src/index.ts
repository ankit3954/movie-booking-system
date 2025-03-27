import express from "express";
import cors from "cors";
import { AppError } from "./utils/AppError";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import { sendResponse } from "./utils/responseHandler";
import executeQuery from "./config/db";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// app.get("/ping", async (req, res, next) => {
//   try {
//     const result = await executeQuery("SELECT 1+1 AS result", [] )
//     sendResponse(res, 200, result)
//   } catch (error) {
//     next(new AppError("DB Connection Failed", 500))
//   }
// });

// Global error handler middleware
app.use(globalErrorHandler);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
