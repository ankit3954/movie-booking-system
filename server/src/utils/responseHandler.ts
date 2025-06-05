import { Response } from "express";

export const sendResponse = (
    success: boolean,
    res: Response,
    statusCode: number,
    data: any = null,
    message: string = "Success"
  ) => {
    res.status(statusCode).json({
      success: success,
      statusCode,
      message,
      data,
    });
  };
  