const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

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

// Log the request information for debugging purpose
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  if (!(Object.keys(req.body).length === 0 && req.body.constructor === Object)) {
    console.log(req.body)
  }
  next()
})

app.use('/feed', feedRoutes)

// MongoDB connection uri
const db_username = 'node_app_user'
const password = '2QbSWJVa64KbXe65'
const db_name = 'posts_sharing'
const MONGODB_URI = `mongodb+srv://${db_username}:${password}@experiment.ejqjk.mongodb.net/${db_name}?retryWrites=true&w=majority`

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
).then(result => {
  console.log('Database Connected.')
  app.listen(8080)
}).catch(err => {
  console.log(err)
})
