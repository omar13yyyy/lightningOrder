import {STORES_EVENTS} from "../../../modules/events/events"

export function registerStoreHandlers(io: any) {


    // استقبال طلبية جديدة
    io.on(STORES_EVENTS.STORE_ORDER_REQUEST, (orderData: any) => {
      console.log("Received new order request:", orderData);

      // هنا ممكن تضيف منطق معالجة الطلب
  
      const response = {
        status: "received",
        orderId: orderData.orderId,
        message: "Order request processed",
      };

      // إرسال رد للعميل الذي أرسل الطلب
      io.emit(STORES_EVENTS.STORE_ORDER_RESPONSE, response);
    });

}

