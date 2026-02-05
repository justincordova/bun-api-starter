import { Response } from 'express';
import { HTTP_STATUS } from '../constants/index';

// Standard API response format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  details?: unknown[];
}

// Generic function to send any type of response
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  response: ApiResponse<T>
): void => {
  res.status(statusCode).json(response);
};

// Send successful response (200 OK)
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  count?: number
): void => {
  sendResponse(res, HTTP_STATUS.OK, { success: true, data, message, count });
};

// Send created response (201 Created)
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string
): void => {
  sendResponse(res, HTTP_STATUS.CREATED, { success: true, data, message });
};

// Send error response
export const sendError = (
  res: Response,
  statusCode: number,
  error: string,
  message?: string
): void => {
  sendResponse(res, statusCode, { success: false, error, message });
};

