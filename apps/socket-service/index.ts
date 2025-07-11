
import express from "express";
import http from "http";
import { setupSocket } from "./socket/socket";

const app = express();
const server = http.createServer(app);
setupSocket(server);

async function socketServer() {
  const PORT = process.env.WEB_SOCKET_PORT||8002
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default socketServer