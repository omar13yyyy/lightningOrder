import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { decodeToken } from "../utils/jwt";

export function socketAuthMiddleware(socket: Socket, next: (err?: ExtendedError) => void) {
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error("No token provided"));

  try {
    const user = decodeToken(token);
    socket.data.user = user; // Ex: { id: "driver_123", role: "driver" }
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
}