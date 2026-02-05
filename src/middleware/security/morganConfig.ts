import morgan from "morgan";
import logger from "../../config/logger";

/*
  Custom stream to pipe Morgan logs to Winston
*/
const stream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

/*
  HTTP request logger middleware
  Logs method, url, status, content-length, and response time
*/
const morganConfig = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

export default morganConfig;
