import { Server, Socket } from "socket.io";
import { DRIVERS_EVENTS, STORES_EVENTS } from "../../../modules/events/events";
import { StoreOrderDecision } from "../types/types";
import { resolveStoreDecision } from "../socket/awaitables";

export function registerStoreHandlers(io: Server, socket: Socket) {
  socket.on(STORES_EVENTS.STORE_ORDER_RESPONSE, (decision: StoreOrderDecision) => {
    resolveStoreDecision(decision); // للسيرفس
    // (اختياري) إشعار السائق
    if (decision.driverId) {
      io.to(`driver_${decision.driverId}`).emit(
        DRIVERS_EVENTS.DRIVER_STORE_DECISION, decision
      );
    }
  });
}
