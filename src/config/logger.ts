import winston from "winston";
import path from "path";
import fs from "fs";

/*
  Custom log levels with priorities
  Lower number = higher priority
*/
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Color codes for console output
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(logColors);

// Format for console output (timestamp, colored level, message, metadata)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaString = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ""}${metaString}`;
  }),
);

// Format for file output (timestamp, JSON)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Mock logger for testing - logs to no-op functions
const createTestLogger = () => {
  const mockFn = () => {};
  return {
    error: mockFn,
    warn: mockFn,
    info: mockFn,
    http: mockFn,
    debug: mockFn,
    add: mockFn,
    remove: mockFn,
    clear: mockFn,
    close: mockFn,
    query: mockFn,
    stream: mockFn,
    configure: mockFn,
    child: mockFn,
    isLevelEnabled: mockFn,
    level: "info",
    levels: logLevels,
    transports: [],
  };
};

// Production logger with file and console transports
const createProductionLogger = () => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.LOG_LEVEL || "info",
    }),
  ];

  if (process.env.NODE_ENV === "production") {
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, "error.log"),
        level: "error",
        format: fileFormat,
        maxsize: 5242880,
        maxFiles: 10,
      }),
      new winston.transports.File({
        filename: path.join(logsDir, "combined.log"),
        format: fileFormat,
        maxsize: 5242880,
        maxFiles: 10,
      }),
      new winston.transports.File({
        filename: path.join(logsDir, "http.log"),
        level: "http",
        format: fileFormat,
        maxsize: 5242880,
        maxFiles: 5,
      }),
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    levels: logLevels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.metadata({
        fillExcept: ["message", "level", "timestamp"],
      }),
    ),
    transports,
    exceptionHandlers:
      process.env.NODE_ENV === "production"
        ? [
            new winston.transports.File({
              filename: path.join(logsDir, "exceptions.log"),
              format: fileFormat,
            }),
          ]
        : [],
    rejectionHandlers:
      process.env.NODE_ENV === "production"
        ? [
            new winston.transports.File({
              filename: path.join(logsDir, "rejections.log"),
              format: fileFormat,
            }),
          ]
        : [],
  });
};

// Development logger with console transport and debug level
const createDevelopmentLogger = () => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    levels: logLevels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.metadata({
        fillExcept: ["message", "level", "timestamp"],
      }),
    ),
    transports: [
      new winston.transports.Console({
        format: consoleFormat,
      }),
    ],
  });
};

// Create appropriate logger based on environment
const createLogger = () => {
  const env = process.env.NODE_ENV;

  if (env === "test") return createTestLogger();
  if (env === "production") return createProductionLogger();
  return createDevelopmentLogger();
};

const logger = createLogger();

// Helper functions for common logging tasks
export const logError = (
  message: string,
  error?: Error | unknown,
  metadata?: Record<string, unknown>,
) => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  logger.error(message, { error: errorObj, ...metadata });
};

export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  responseTime: number,
) => {
  logger.http(`${method} ${url} ${statusCode} - ${responseTime}ms`);
};

export const logStartup = (
  port: number,
  environment: string,
  processId: number,
) => {
  logger.info(`Server started on port ${port}`, {
    port,
    environment,
    processId,
    timestamp: new Date().toISOString(),
  });
};

export const logShutdown = (signal: string, graceful: boolean = true) => {
  logger.info(`Server shutdown initiated`, {
    signal,
    graceful,
    timestamp: new Date().toISOString(),
  });
};

export default logger;
