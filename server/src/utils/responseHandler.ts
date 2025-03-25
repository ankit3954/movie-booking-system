export const sendResponse = (
    res: any,
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
  