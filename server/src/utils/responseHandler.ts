import { Response } from "express";

export const sendResponse = (
    res: Response,
    statusCode: number,
    data: any = null,
    message: string = "Success"
  ) => {
    res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  };
  