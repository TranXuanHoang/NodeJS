import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const connectId = randomBytes(4).toString('hex')
const stan = nats.connect('ticketing', connectId, {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  const options = stan.subscriptionOptions()
    .setManualAckMode(true) // up to this listener to notify NATS the message has been received
    .setDeliverAllAvailable() // Get all events be redelivered when app restarted
    .setDurableName('orders-service') // Only get events redelivered if they haven't been processed

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group', // Each event is only sent to one listener that subscribed to this queue group
    options
  )

  subscription.on('message', (msg: Message) => {
    const data = msg.getData()

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data:\n` +
        `${JSON.stringify(JSON.parse(data), null, 2)}`)
    }

    // Acknowledge the NATS Streaming Server that the message was already
    // received AND processed
    msg.ack()
  })
})

// Handle interupt signal
process.on('SIGINT', () => stan.close())

// Handle terminate signal
process.on('SIGTERM', () => stan.close())
