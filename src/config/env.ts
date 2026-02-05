import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = Number(process.env.PORT) || 3000;
export const APP_NAME = process.env.APP_NAME || 'bun-api-starter';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173';
export const RATE_LIMIT_POINTS = Number(process.env.RATE_LIMIT_POINTS) || 100;
export const RATE_LIMIT_DURATION = Number(process.env.RATE_LIMIT_DURATION) || 60;
