import { RateLimiterMemory } from "rate-limiter-flexible";
import { RATE_LIMIT_POINTS, RATE_LIMIT_DURATION } from "../../config/env";
import { Request } from "express";

/*
  Rate limiter
  Limits requests from each IP to prevent abuse.
  Returns 429 if rate limit is exceeded.
  Uses Express's built-in req.ip with trust proxy enabled for proper IP extraction behind load balancers.
*/
const rateLimiter = new RateLimiterMemory({
  keyPrefix: "api_limit",
  points: RATE_LIMIT_POINTS,
  duration: RATE_LIMIT_DURATION,
});

export const rateLimiterConfig = async (
  req: Request,
  res: { status: (code: number) => { json: (data: unknown) => void } },
  next: () => void,
): Promise<void> => {
  const key = req.ip || "unknown";

  try {
    await rateLimiter.consume(key);
    next();
  } catch {
    res.status(429).json({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: RATE_LIMIT_DURATION,
    });
  }
};

export default rateLimiterConfig;
