import { Request, Response } from 'express';
import logger from '../../config/logger';
import { sendError } from '../../utils/response';
import { NOT_FOUND_MESSAGE, HTTP_STATUS } from '../../constants';

/*
  404 Not Found handler middleware
  Catches requests to routes that don't exist
*/
export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = (req as { id?: string }).id;

  logger.warn('ROUTE_NOT_FOUND', {
    requestId,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  sendError(res, HTTP_STATUS.NOT_FOUND, 'Route not found', NOT_FOUND_MESSAGE);
};
