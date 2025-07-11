export const ORDER_EVENTS = {
  //nats event
  ORDER_CREATED: "order:created", 
  ORDER_ACCEPTED: "order:accepted", 
  ORDER_DETAILS: "order:detials", 

};
export const DRIVERS_EVENTS = {
  //nats event
  DRIVERS_COLLECT_REQUEST: "drivers:collect:Request",
  DRIVERS_COLLECT_RESPONSE: "drivers:collect:Response",
  DRIVER_SINGLE_REQUEST: "driver:single:Request",
  DRIVER_SINGLE_RESPONSE: "driver:single:Response",


  //socket events talk with driver
  DRIVER_LOCATION_REQUEST: "driver:location:Request",
  DRIVER_Location_RESPONSE: "driver:location:Response",
  JOIN_DRIVER_ROOM: "joinDriverRoom",
  DRIVERS_ORDER_REQUEST: "drivers:order:Request",
  DRIVERS_ORDER_RESPONSE: "drivers:order:Response",
};
export const STORES_EVENTS = {

  //socket events talk with store

  JOIN_STORE_ROOM: "joinStoreRoom",
  STORE_ORDER_REQUEST: "store:order:request",
  STORE_ORDER_RESPONSE: "store:order:response",
};