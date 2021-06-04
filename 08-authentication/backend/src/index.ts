// Main starting point of the application
import express from 'express'
import morgan from 'morgan'
import { appRoutes } from './routers/router'

const app = express()

// Log incoming requests
app.use(morgan('combined'))

// Parse incoming request body to JSON
app.use(express.json())

app.use(appRoutes)

const port = process.env.PORT || 3090
app.listen(port, () => {
  console.log('[Backend] Listening on port', port)
})
