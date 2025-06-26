import dotenv from 'dotenv';
dotenv.config()
export const env = {
  PORT: process.env.WEB_SOCKET_PORT || 8001,
  JWT_SECRET: process.env.JWT_SECRET || "super_secret_key",
  NATS_URL: process.env.NATS_URL || "nats://localhost:4222",
};
export const WEB_SOCKET_PORT = process.env.WEB_SOCKET_PORT 
export const NATS_URL = process.env.NATS_URL 
