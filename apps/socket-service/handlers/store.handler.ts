import { Server, Socket } from "socket.io";
import { DRIVERS_EVENTS, STORES_EVENTS } from "../../../modules/events/events";
import { StoreOrderDecision } from "../types/types";
import { resolveStoreDecision } from "../socket/awaitables";

export function registerStoreHandlers(io: Server, socket: Socket) {
  socket.on(STORES_EVENTS.STORE_ORDER_RESPONSE, (decision: StoreOrderDecision) => {
    console.log("decision : ",decision)
    resolveStoreDecision(decision); // للسيرفس

  });
}
