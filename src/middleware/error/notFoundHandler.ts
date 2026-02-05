import { Request, Response } from 'express';
import logger from '../../config/logger';
import { sendError } from '../../utils/response';
import { NOT_FOUND_MESSAGE, HTTP_STATUS } from '../../constants';

/*
  Fields to redact in logs for security
  Redact sensitive fields from request body before logging
*/
const REDACT_FIELDS = ['password', 'token', 'authorization'];

const redactBody = (body: Record<string, unknown>) => {
  if (!body) return {};
  const copy = { ...body };
  REDACT_FIELDS.forEach((field) => {
    if (copy[field]) copy[field] = '[REDACTED]';
  });
  return copy;
};

/*
  404 Not Found handler middleware
  Catches requests to routes that don't exist
*/
export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = (req as { id?: string }).id;
  const metadata = {
    requestId,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    query: req.query,
    body: redactBody(req.body),
  };

  logger.warn('ROUTE_NOT_FOUND', metadata);

  sendError(res, HTTP_STATUS.NOT_FOUND, 'Route not found', NOT_FOUND_MESSAGE);
};
