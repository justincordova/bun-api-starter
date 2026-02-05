import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import { HTTP_STATUS } from "../../constants";

// Helper function to send error responses
const sendError = (
  res: Response,
  statusCode: number,
  error: string,
  message?: string,
): void => {
  res.status(statusCode).json({ success: false, error, message });
};

/*
  Global error handler middleware
  Catches all errors thrown in application
  Logs error details and returns appropriate error response
*/
export const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const requestId = (req as { id?: string }).id;

  logger.error("Unhandled error occurred", {
    requestId,
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong on our end"
      : err.message;

  sendError(res, statusCode, "Internal Server Error", message);
};
