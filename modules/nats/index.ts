import { initNats } from './nats';
import { subscribeToOrderRequests } from './subscribers/orderRequest.sub';

export const main = async (): Promise<void> => {
      await initNats();
      await subscribeToOrderRequests();

};
