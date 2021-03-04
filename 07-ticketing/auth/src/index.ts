import { json } from 'body-parser'
import express from 'express'
import { errorHandler } from './middlewares/error-handler'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => {
  // Throw an error for any routes that are not found
  throw new NotFoundError()
})

app.use(errorHandler)

app.listen(3000, () => {
  console.log('[Auth] Listening on port 3000!')
})
