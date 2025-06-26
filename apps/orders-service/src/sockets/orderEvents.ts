import Ajv from 'ajv';
import {orderSchema}  from '../schemas/order.schema';

const ajv = new Ajv();
const validate = ajv.compile(orderSchema);

export const handleOrderEvents=  (socket) => {
  socket.on("order:create", (data) => {
    if (!validate(data)) {
      return socket.emit("error", {
        type: "validation_error",
        errors: validate.errors
      });
    }
    
    
    console.log("طلب جديد:", data);
  });
};