import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 8002,
  NATS_URL: process.env.NATS_URL || "nats://localhost:4222",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};