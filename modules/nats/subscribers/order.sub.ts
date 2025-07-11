


import { DRIVERS_EVENTS ,ORDER_EVENTS } from '../../events/events';
import { getNatsConnection } from '../nats';
export async function subscribeToOrderCreated() {
  const nc = getNatsConnection();
  const sub = nc.subscribe(ORDER_EVENTS.ORDER_CREATED);
  console.log(`[NATS] Subscribed to ${ORDER_EVENTS.ORDER_CREATED}`);

  for await (const msg of sub) {
    const data = JSON.parse(msg.data.toString());
    console.log(`[NATS] Received ${ORDER_EVENTS.ORDER_CREATED}`, data);


  }
}

export async function subscribeToOrderAccepted() {
  const nc = getNatsConnection();
  const sub = nc.subscribe(ORDER_EVENTS.ORDER_ACCEPTED);
  console.log(`[NATS] Subscribed to ${ORDER_EVENTS.ORDER_ACCEPTED}`);

  for await (const msg of sub) {
    const data = JSON.parse(msg.data.toString());
    console.log(`[NATS] Received ${ORDER_EVENTS.ORDER_ACCEPTED}`, data);

  }
}
export async function subscribeToOrderDetails() {
  const nc = getNatsConnection();
  const sub = nc.subscribe(ORDER_EVENTS.ORDER_DETAILS);
  console.log(`[NATS] Subscribed to ${ORDER_EVENTS.ORDER_DETAILS}`);

  for await (const msg of sub) {
    const data = JSON.parse(msg.data.toString());
    console.log(`[NATS] Received ${ORDER_EVENTS.ORDER_DETAILS}`, data);

  }
}