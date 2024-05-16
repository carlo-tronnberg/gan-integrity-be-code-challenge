const amqp = require('amqplib');
const { calculateNearCities } = require('../src/controllers/area.js');

const rabbitmq = 'amqp://rabbitmq?heartbeat=60';

const startConsumer = async () => {
  console.log('Consumer starting...');
  const conn = await amqp.connect(rabbitmq);

  conn.on('error', function (error) {
    throw new Error('[AMQP] conn error', error.message);
  });

  const ch = await conn.createChannel();

  ch.on('error', function (error) {
    throw new Error('[AMQP] conn error', error.message);
  });

  await ch.assertQueue('area_calculation', { durable: true });
  ch.prefetch(1);
  ch.consume(
    'area_calculation',
    async (message) => {
      const { result, error } = calculateNearCities(
        JSON.parse(message.content),
      );

      if (error) ch.cancel(message);

      ch.ack(message);
    },
    { noAck: false },
  );
};

module.exports = { startConsumer };
