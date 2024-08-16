const {
  consumerQueue,
  connectToRabbitMQ,
} = require('../dbs/init.rabbit')

const log = console.log

console.log = function() {
  log.apply(console, [new Date()].concat(arguments))
}

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMQ()
      await consumerQueue(channel, queueName)
    } catch (error) {
      console.error(`Error consumerToQueue:: `, error)
    }
  },

  consumerToQueueNormal: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMQ()
      const notificationQueue = 'notification_queue'

      // 1. TTL
      // const timeExpired = 15000
      // setTimeout(() => {
      //   channel.consume(notificationQueue, msg => {
      //     console.log(`SEND notification queue successfully processed: ${notificationQueue}::`, msg.content.toString())
      //     channel.ack(msg)
      //   })
      // }, timeExpired)

      // 2. LOGIC
      channel.consume(notificationQueue, msg => {
        try {
          const numberTest = Math.random()
          console.log({ numberTest })
          if (numberTest < 0.8) {
            throw new Error('Send notification failed: HOT FIX')
          }

          console.log(`SEND notification queue successfully processed <${notificationQueue}>:`, msg.content.toString())
          channel.ack(msg)
        } catch (error) {
          // console.error('SEND notification error: ', error);
          channel.nack(msg, false, false)
          // negativeAcknowledge
          // nack(message: Message, allUpTo?: boolean, requeue?: boolean): void;
          // Lỗi ở hàng đợi trước được đẩy lên hàng đợi xử lý lỗi
          // allUpTo: true => tất cả các message trước đó cũng bị đẩy lên hàng đợi xử lý lỗi
          // allUpTo: false => chỉ đẩy message hiện tại lên hàng đợi xử lý lỗi
          // requeue: true => đẩy message lên hàng đợi xử lý lỗi
          // requeue: false => xóa message khỏi hàng đợi
        }
      })

    } catch (error) {
      console.error(`Error consumerToQueueNormal:: `, error)
    }
  },

  consumerToQueueDLX: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMQ()

      const notificationExchangeDLX = 'notification_exchange_DLX'
      const notificationRoutingKeyDLX = 'notification_routing_key_DLX'
      const notificationQueueHandler = 'notification_queue_handler'

      await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true })
      
      const queueResult = await channel.assertQueue(notificationQueueHandler, {
        exclusive: false,
      })

      await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
      await channel.consume(queueResult.queue, msgFailed => {
        console.log(`this notification error: pls hot fix:: `, msgFailed.content.toString())
      }, {
        noAck: true
      })

    } catch (error) {
      console.error(`Error consumerToQueueDLX:: `, error)
      throw error;
    }
  }
}

module.exports = messageService;