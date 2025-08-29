import express from "express";
import http from "http";
import { setupSocket, sendOrderToDriver } from "./socket/socket";

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

async function socketServer() {
  const PORT = process.env.WEB_SOCKET_PORT || 8002;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// (اختياري) تصدير دوال إرسال الطلب ليستفيد منها بقية النظام
export { sendOrderToDriver };
export default socketServer;

