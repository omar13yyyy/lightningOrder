import { Server, Socket } from "socket.io";

export function registerDriverHandlers(io: Server, socket: Socket) {
  const user = socket.data.user;
  if (user.role !== "driver") return;

  const room = `driver:${user.id}`;
  socket.join(room);
  console.log(`🚗 Driver ${user.id} joined room ${room}`);

  socket.on("locationUpdate", (location) => {
    console.log(`📍 Driver ${user.id} location:`, location);
    // هنا ممكن تخزن الموقع في Redis أو ترسله لـ dispatch-service
  });

  socket.on("acceptOrder", ({ orderId }) => {
    console.log(`✅ Driver ${user.id} accepted order ${orderId}`);
  });
}