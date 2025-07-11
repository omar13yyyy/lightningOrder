import { Server } from "socket.io";
import { authMiddleware } from "../middlewares/auth.middleware";
import { registerDriversHandlers } from "../handlers/driver.handler";
import { registerStoreHandlers } from "../handlers/restaurant.handler";
import {DRIVERS_EVENTS,STORES_EVENTS} from "../../../modules/events/events"

export function setupSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.use(authMiddleware);

io.on("connection", (socket) => {

  console.log(`Client connected: ${socket.id}`);
  const role = socket.role;
  if( role == "driver"){
  socket.on(DRIVERS_EVENTS.JOIN_DRIVER_ROOM, (driverId) => {
    socket.join(`driver_${driverId}`);

    registerDriversHandlers(socket);

  });
  }else if( role == "store"){
  socket.on(STORES_EVENTS.JOIN_STORE_ROOM, (driverId) => {
    socket.join(`store_${driverId}`);

    registerStoreHandlers(socket);

  });
  }
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

});

  return io;
}
