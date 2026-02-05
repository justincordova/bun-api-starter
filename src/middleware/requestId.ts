import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/*
  Assign a unique ID to every request for tracing and debugging
  Uses existing X-Request-ID header if present, otherwise generates a UUID
*/
export const requestId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = (req.headers['x-request-id'] as string) || randomUUID();
  (req as Request & { id: string }).id = id;
  res.setHeader('x-request-id', id);
  next();
};
