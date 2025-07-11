
import { DRIVERS_EVENTS ,ORDER_EVENTS } from '../../events/events';
import { getNatsConnection } from '../nats';
import { PublishDriversCollectRequest, PublishDriversCollectResponse, PublishDriversSingleRequest, PublishDriversSingleResponse } from '../types/type';

export async function publishCollectRequest(publishDriversCollectRequest: PublishDriversCollectRequest) {
  const nc = getNatsConnection();
  nc.publish(DRIVERS_EVENTS.DRIVERS_COLLECT_REQUEST, new TextEncoder().encode(JSON.stringify(publishDriversCollectRequest)));
  console.log('[NATS] Published collect request to drivers');
}

export async function publishDriverResponse(publishDriversCollectRequest: PublishDriversCollectResponse) {
  const nc = getNatsConnection();
  nc.publish(DRIVERS_EVENTS.DRIVERS_COLLECT_RESPONSE, new TextEncoder().encode(JSON.stringify(publishDriversCollectRequest)));
  console.log('[NATS] Published driver response');
}


export async function publishSingleRequest(publishDriversSingleRequest: PublishDriversSingleRequest) {
  const nc = getNatsConnection();
  nc.publish(ORDER_EVENTS.ORDER_ACCEPTED, new TextEncoder().encode(JSON.stringify(publishDriversSingleRequest)));
  console.log('[NATS] Published order accepted');
}
export async function publishSingleCreated(publishDriversSingleResponse: PublishDriversSingleResponse) {
  const nc = getNatsConnection();
  nc.publish(ORDER_EVENTS.ORDER_CREATED, new TextEncoder().encode(JSON.stringify(publishDriversSingleResponse)));
  console.log('[NATS] Published order accepted');
}
