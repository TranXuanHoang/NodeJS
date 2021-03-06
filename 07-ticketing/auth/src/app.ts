import { errorHandler, NotFoundError } from '@hoang-ticketing/common'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors' // handle error in async functions
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

const app = express()

// Traffic requests go through Nginx Ingress - which means they are proxied
// Tell Express to trust those HTTPS requests even though they are proxied
app.set('trust proxy', true)

app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
  // Throw an error for any routes that are not found
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
