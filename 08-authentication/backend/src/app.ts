// Main starting point of the application
import express from 'express'
import morgan from 'morgan'
import { appRoutes } from './routers/router'

const app = express()

// Log incoming requests
app.use(morgan('combined'))

// Config CORS
// Note that, there is a 'cors' npm package library allowing simple and straightforward
// configuration of CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // The graphqlHTTP middleware in
  //     app.use('/graphql', graphqlHTTP(...))
  // automatically reject any requests that are not POST.
  // To allow OPTIONS requests (avoid CORS errors on clients),
  // We immediately return a response with status of 200 when the request is a OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

// Parse incoming request body to JSON
app.use(express.json())

app.use(appRoutes)

export { app }

