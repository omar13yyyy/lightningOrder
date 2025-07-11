import { DRIVERS_EVENTS } from '../../events/events';
import { getNatsConnection } from '../nats';

export async function subscribeToCollectRequests() {
  const nc = getNatsConnection();
  const sub = nc.subscribe(DRIVERS_EVENTS.DRIVERS_COLLECT_REQUEST);
  console.log('[NATS] Subscribed to', DRIVERS_EVENTS.DRIVERS_COLLECT_REQUEST);

  for await (const msg of sub) {
    const data = JSON.parse(msg.data.toString());
    console.log('[NATS] Received collect request', data);

  }
}

export async function subscribeToCollectResponses() {
  const nc = getNatsConnection();
  const sub = nc.subscribe(DRIVERS_EVENTS.DRIVERS_COLLECT_RESPONSE);
  console.log('[NATS] Subscribed to', DRIVERS_EVENTS.DRIVERS_COLLECT_RESPONSE);

  for await (const msg of sub) {
    const data = JSON.parse(msg.data.toString());
    console.log('[NATS] Received driver response', data);

  }
}

export async function subscribeToSingleRequests() {
  const nc = getNatsConnection();
  const sub = nc.subscribe(DRIVERS_EVENTS.DRIVER_SINGLE_REQUEST);
  console.log('[NATS] Subscribed to', DRIVERS_EVENTS.DRIVER_SINGLE_REQUEST);

  for await (const msg of sub) {
    const data = JSON.parse(msg.data.toString());
    console.log('[NATS] Received collect request', data);

  }
}

export async function subscribeToSingleResponses() {
  const nc = getNatsConnection();
  const sub = nc.subscribe(DRIVERS_EVENTS.DRIVER_SINGLE_RESPONSE);
  console.log('[NATS] Subscribed to', DRIVERS_EVENTS.DRIVER_SINGLE_RESPONSE);

  for await (const msg of sub) {
    const data = JSON.parse(msg.data.toString());
    console.log('[NATS] Received driver response', data);

  }
}