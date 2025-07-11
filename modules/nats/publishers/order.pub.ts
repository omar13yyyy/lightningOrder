
import { DRIVERS_EVENTS ,ORDER_EVENTS } from '../../events/events';
import { getNatsConnection } from '../nats';
import { PublishOrderAccepted, PublishOrderCreated, PublishOrderDetails } from '../types/type';

export async function publishOrderAccepted(data: PublishOrderAccepted) {
  const nc = getNatsConnection();
  nc.publish(ORDER_EVENTS.ORDER_ACCEPTED, new TextEncoder().encode(JSON.stringify(data)));
  console.log('[NATS] Published order accepted');
}
export async function publishOrderCreated(data: PublishOrderCreated) {
  const nc = getNatsConnection();
  nc.publish(ORDER_EVENTS.ORDER_CREATED, new TextEncoder().encode(JSON.stringify(data)));
  console.log('[NATS] Published order accepted');
}
export async function publishOrderDetails(data: PublishOrderDetails) {
  const nc = getNatsConnection();
  nc.publish(ORDER_EVENTS.ORDER_DETAILS, new TextEncoder().encode(JSON.stringify(data)));
  console.log('[NATS] Published order accepted');
}
