import { Server, Socket } from "socket.io";
import { authMiddleware } from "../middlewares/auth.middleware";
import { registerDriversHandlers } from "../handlers/driver.handler";
import { registerStoreHandlers } from "../handlers/store.handler";
import { DRIVERS_EVENTS, STORES_EVENTS } from "../../../modules/events/events";
import { DriverId, StoreId, DriverOrderRequest, StoreOrderRequest } from "../types/types";
import { waitForDriverDecision, waitForStoreDecision } from "./awaitables";
import { OrderWithDriver } from "../../partners-stores-managers-dashboards-service/src/types/finderClient";

let ioRef: Server | null = null;

export function setupSocket(server: any) {
  const io = new Server(server, { cors: { origin: "*" } });
  ioRef = io;
  io.use(authMiddleware);

  io.on("connection", (socket: Socket) => {
    const role = socket.role;
    
    if (role === "driver") {
      socket.on(DRIVERS_EVENTS.JOIN_DRIVER_ROOM, (driverId: DriverId) => {
              console.log(`driver_${socket.driver_id}`)
          
        socket.data.driverId = socket.driver_id;
        socket.join(`driver_${socket.driver_id}`);
        registerDriversHandlers(io, socket);
      });
    } else if (role === "store") {
      console.log(`store_${socket.store_id}`)
      socket.on(STORES_EVENTS.JOIN_STORE_ROOM, (storeId: StoreId) => {
        socket.data.storeId = storeId;
        socket.join(`store_${socket.store_id}`);
        socket.join("stores");

        registerStoreHandlers(io, socket);
      });
    }
  });

  return io;
}

/* ----- إرسال ----- */
export function sendOrderToDriver(driverId: DriverId, payload: OrderWithDriver) {
  ioRef?.to(`driver_${driverId}`).emit(DRIVERS_EVENTS.DRIVERS_ORDER_REQUEST, payload);
}
export function sendOrderToStore(storeId: StoreId, payload: StoreOrderRequest) {
  ioRef?.to(`store_${storeId}`).emit(STORES_EVENTS.STORE_ORDER_REQUEST, payload);
}

/* ----- انتظار القرارات (مصدّرة للسيرفس) ----- */
export { waitForDriverDecision, waitForStoreDecision };
