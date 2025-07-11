
import {DRIVERS_EVENTS} from "../../../modules/events/events"


export function registerDriversHandlers(io: any) {




  // استقبال طلب طلبية من السائق
  io.on(DRIVERS_EVENTS.DRIVERS_ORDER_REQUEST, (orderData) => {
    console.log("Received order request from driver:", orderData);


    const response = {
      status: "accepted",
      orderId: orderData.orderId,
      message: "Order request accepted",
    };

    io.emit(DRIVERS_EVENTS.DRIVERS_ORDER_RESPONSE, response);
  });

  io.on(DRIVERS_EVENTS.DRIVER_LOCATION_REQUEST, (orderData) => {
    console.log("Received order request from driver:", orderData);


    const response = {
      status: "accepted",
      orderId: orderData.orderId,
      message: "Order request accepted",
    };

    io.emit(DRIVERS_EVENTS.DRIVER_Location_RESPONSE, response);
  });


}