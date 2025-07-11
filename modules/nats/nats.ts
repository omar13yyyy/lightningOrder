import { connect, NatsConnection } from 'nats';

let natsConnection: NatsConnection;

export async function initNats() {
  natsConnection = await connect({ servers: 'nats://localhost:4222' });
  console.log('[NATS] Connected');

  return natsConnection;
}

export function getNatsConnection(): NatsConnection {
  if (!natsConnection) throw new Error("NATS not initialized");
  return natsConnection;
}