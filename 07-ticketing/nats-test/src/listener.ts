import { randomBytes } from 'crypto'
import nats from 'node-nats-streaming'
import { TicketCreatedListener } from './events/ticket-created-listener'

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

  new TicketCreatedListener(stan).listen()
})

// Handle interupt signal
process.on('SIGINT', () => stan.close())

// Handle terminate signal
process.on('SIGTERM', () => stan.close())
