import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  channel = await connection.createChannel();
  console.log('[rabbitmq-server] Connected');
}

export async function publish(queue: string, data: any) {
  if (!channel) throw new Error('rabbitmq-server not connected');
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
}