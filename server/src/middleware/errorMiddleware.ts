import { NextFunction, Response, Request } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler  = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack only in development
    });
}