// modules/events/events.ts
export const DRIVERS_EVENTS = {
  JOIN_DRIVER_ROOM: "driver:join",
  DRIVERS_ORDER_REQUEST: "driver:order:request",     // server -> driver
  DRIVERS_ORDER_RESPONSE: "driver:order:response",   // driver -> server
  DRIVER_LOCATION_RESPONSE: "driver:location:update",
  DRIVER_STORE_DECISION: "driver:store:decision",    // server -> driver
} as const;

export const STORES_EVENTS = {
  JOIN_STORE_ROOM: "store:join",
  STORE_ORDER_REQUEST: "store:order:request",        // server -> store
  STORE_ORDER_RESPONSE: "store:order:response",      // store -> server
  STORE_ORDER_DRIVER_DECISION: "store:driver:decision", // server -> store
  STORE_DRIVER_LOCATION_PUSH: "store:driver:location",  // server -> store
} as const;