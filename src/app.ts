import express, {
  Request,
  Response,
} from "express";
import logger from "./config/logger";
import { notFoundHandler } from "./middleware/error/notFoundHandler";
import { errorHandler } from "./middleware/error/errorHandler";
import { requestId } from "./middleware/requestId";

// Security Middleware
import corsConfig from "./middleware/security/corsConfig";
import helmetConfig from "./middleware/security/helmetConfig";
import compressionConfig from "./middleware/security/compressionConfig";
import rateLimiterConfig from "./middleware/security/rateLimiterConfig";
import morganConfig from "./middleware/security/morganConfig";

// Routes
import exampleRoutes from "./modules/example/routes";

const app = express();

// Assign unique ID to every request for tracing
app.use(requestId);

// Parse incoming JSON requests (max 10MB)
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies (max 10MB)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy to get real IP addresses (behind load balancer/reverse proxy)
app.set("trust proxy", true);

/*
  Security middleware - only enable in non-development environments
  Skipped in development for easier debugging
*/
if (process.env.NODE_ENV !== "development") {
  app.use(corsConfig);
  app.use(helmetConfig);
  app.use(compressionConfig);
  app.use(morganConfig);
  app.use(rateLimiterConfig);
}

// Routes
app.use("/api/example", exampleRoutes);

// Root route - API info and available endpoints
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: `${process.env.APP_NAME || "API"} Server`,
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api/example",
    },
  });
});

// Health check route - For load balancers and monitoring
app.get("/health", (_req: Request, res: Response) => {
  logger.http("Health check requested");
  const memUsage = process.memoryUsage();

  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
    },
  });
});

// Error handling - order matters: notFoundHandler first, then errorHandler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
