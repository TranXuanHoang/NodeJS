import { errorHandler, NotFoundError } from '@hoang-ticketing/common'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors' // handle error in async functions

const app = express()

// Traffic requests go through Nginx Ingress - which means they are proxied
// Tell Express to trust those HTTPS requests even though they are proxied
app.set('trust proxy', true)

app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

// Routes here

app.all('*', async () => {
  // Throw an error for any routes that are not found
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
