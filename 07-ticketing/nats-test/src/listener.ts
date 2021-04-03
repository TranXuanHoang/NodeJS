import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const connectId = randomBytes(4).toString('hex')
const stan = nats.connect('ticketing', connectId, {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  const options = stan.subscriptionOptions()
    .setManualAckMode(true) // up to this listener to notify NATS the message has been received

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
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
