const express = require('express')
const bodyParser = require('body-parser')

const feedRoutes = require('./routes/feed')

const app = express()

// Parse incoming request body to JSON
// app.use(bodyParser.urlencoded()) // Content-Type: x-www-form-urlencoded
app.use(bodyParser.json()) // Content-Type: application/json

// Config CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/feed', feedRoutes)

app.listen(8080)
