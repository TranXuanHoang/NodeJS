import { currentUser, errorHandler, NotFoundError } from '@hoang-ticketing/common'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors' // handle error in async functions
import { deleteOrderRouter } from './routes/delete'
import { indexOrderRouter } from './routes/index'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'

const app = express()

// Traffic requests go through Nginx Ingress - which means they are proxied
// Tell Express to trust those HTTPS requests even though they are proxied
app.set('trust proxy', true)

app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

// Check if there is a JSON Web Token and decode it to extract
// the user information
app.use(currentUser)

app.use(newOrderRouter)
app.use(deleteOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)

app.all('*', async () => {
  // Throw an error for any routes that are not found
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
