'use strict';

const amqp = require('amqplib');

const rabbitmq = 'amqp://rabbitmq?heartbeat=60';

//URI for local use
// const rabbitmq = "amqp://localhost:5672?heartbeat=60"

const sendMessage = async (message) => {
  const conn = await amqp.connect(rabbitmq);
  const channel = await conn.createChannel();

  const res = await channel.assertQueue(message.queue, { durable: true });
  if (!res.queue) throw new Error('failed to open the queue');

  channel.sendToQueue(
    message.queue,
    Buffer.from(JSON.stringify(message.data)),
    { deliveryMode: true },
  );
  await channel.close();
  await conn.close();

  return true;
};

module.exports = { sendMessage };
