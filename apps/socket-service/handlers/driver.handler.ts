import { Server, Socket } from "socket.io";
import {
  DRIVERS_EVENTS,
  STORES_EVENTS,
} from "../../../modules/events/events";
import {
  DriverLocationPayload,
  DriverOrderDecision,
} from "../types/types";
import { resolveDriverDecision } from "../socket/awaitables";

const driverLocations = new Map<string, { loc: DriverLocationPayload; at: number }>();
const STALE_MS = 45_000;
setInterval(() => {
  const now = Date.now();
  for (const [driverId, rec] of driverLocations.entries()) {
    if (now - rec.at > STALE_MS) driverLocations.delete(driverId);
  }
}, 30_000);

export function registerDriversHandlers(io: Server, socket: Socket) {
  socket.on(
    DRIVERS_EVENTS.DRIVER_LOCATION_RESPONSE,
    (payload: DriverLocationPayload) => {
      const driverId = socket.data.driverId || payload.driverId;
      if (!driverId) return;
      driverLocations.set(String(driverId), { loc: { ...payload, driverId }, at: Date.now() });
      io.to("stores").emit(STORES_EVENTS.STORE_DRIVER_LOCATION_PUSH, {
        driverId,
        location: payload,
        ts: Date.now(),
      });
    }
  );

  socket.on(
    DRIVERS_EVENTS.DRIVERS_ORDER_RESPONSE,
    (decision: DriverOrderDecision) => {
      // مرّر القرار لمنتظر الخدمة
      resolveDriverDecision(decision);

      // وأبلغ المتجر أيضًا
      const { storeId } = decision;
      if (storeId) {
        io.to(`store_${storeId}`).emit(STORES_EVENTS.STORE_ORDER_DRIVER_DECISION, decision);
      }
    }
  );
}
