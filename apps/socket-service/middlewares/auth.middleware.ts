import jwt from "jsonwebtoken";

export function authMiddleware(socket: any, next: Function) {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET_DRIVER!);
    socket.driver_id = payload.driver_id;
    socket.role = "driver"
    next();
  } catch (err) {
      try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET_STORE!);
    socket.store_id = payload.store_id;
    socket.role = "store"
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
  }
}