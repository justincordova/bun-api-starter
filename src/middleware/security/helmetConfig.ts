import helmetLib from "helmet";
import { RequestHandler } from "express";

/*
  Helmet middleware for HTTP security headers
  Content security policy and cross-origin embedder policy disabled for flexibility
*/
const helmetConfig: RequestHandler = helmetLib({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});

export default helmetConfig;
