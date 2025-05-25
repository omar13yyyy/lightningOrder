import {handleOrderEvents} from './orderEvents'

export const orderSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Order socket client connected:", socket.id);
    handleOrderEvents(socket);
  });
};