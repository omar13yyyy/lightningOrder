import amqp from 'amqplib';

export async function subscribe(queue: string, handler: (data: any) => void) {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      handler(data);
      channel.ack(msg);
    }
  });

  console.log(`[RabbitMQ] Subscribed to ${queue}`);
}