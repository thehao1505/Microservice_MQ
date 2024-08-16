const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    if (!connection) throw new Error('Connection to RabbitMQ failed');

    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();

    const queue = 'test_queue';
    const message = 'Hello World!';

    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));

    await connection.close();
  } catch (error) {
    console.error(`Error connecting to RabbitMQ for test`, error);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true })
    console.log(`Waiting for messages...`)
    channel.consume(queueName, msg => {
      console.log(`Received message: ${queueName}::`, msg.content.toString())
      // 1. find User following that shop
      // 2. send mesage to user
      // 3. yes, ok ===> success
      // 4. error setup DLX (Dead Letter Exchange)
    }, {
      noAck: true
    })
  } catch (error) {
    console.error(`Error publish message to rabbitMQ::`, error)
    throw error
  }
}

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue
};