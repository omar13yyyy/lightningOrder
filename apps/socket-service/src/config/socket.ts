import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/auth.middleware";
import { registerDriverHandlers } from "../handlers/driver.handler";

let io: Server;

export function initSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);
    registerDriverHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}

export { io };