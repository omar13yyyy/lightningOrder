import { connect, StringCodec } from "nats";
import { env } from "./env";
import { io } from "./socket";

export async function initNats() {
  const sc = StringCodec();
  const nc = await connect({ servers: env.NATS_URL });

  const sub = nc.subscribe("driver.*.new_order");

  (async () => {
    for await (const msg of sub) {
      const [_, driverId] = msg.subject.split(".");
      const data = JSON.parse(sc.decode(msg.data));

      console.log(`📦 Received new_order for driver ${driverId}`, data);
      io.to(`driver:${driverId}`).emit("newOrder", data);
    }
  })();

  console.log("📡 NATS connected and listening for driver.*.new_order");
}