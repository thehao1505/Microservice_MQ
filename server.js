const { consumerToQueue, consumerToQueueNormal, consumerToQueueDLX } = require('./src/services/consumerQueue.service')

const queueName = 'test-topic'
// consumerToQueue(queueName).then( () => {
//   console.log(`Message consumer started ${queueName}`)
// }).catch(err => {
//   console.error(`Message Erroe: ${err.message}`)
// })

consumerToQueueNormal(queueName).then( () => {
  console.log(`Message consumerToQueueNormal started ${queueName}`)
}).catch(err => {
  console.error(`Message Error: ${err.message}`)
})

consumerToQueueDLX(queueName).then( () => {
  console.log(`Message consumerToQueueDLX started ${queueName}`)
}).catch(err => {
  console.error(`Message Error: ${err.message}`)
})