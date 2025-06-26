import { createServer } from "http";
import express from "express";
import { initSocket } from "./config/socket";
import { initNats } from "./config/nats";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

initSocket(server);
initNats();

server.listen(8000, () => {
  console.log("🚀 Driver Socket Service running on port 8000");
});