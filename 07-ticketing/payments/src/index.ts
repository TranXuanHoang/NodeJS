import 'express-async-errors' // handle error in async functions
import mongoose from 'mongoose'
import { app } from './app'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
  console.log('Starting...')

  if (!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined')
  }
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })
    // Handle interupt and terminate signals
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    // Listen for events emitted from NATS
    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
  }

  app.listen(3000, () => {
    console.log('[Tickets] Listening on port 3000!')
  })
}

start()
