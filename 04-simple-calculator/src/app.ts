// Instead of using
// const express = require('express')
// TypeScript allow the following import notation - which is prefered
// as code autocompletion in .ts file will work
import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'

import historiesRoutes from './routes/histories'

const app = express()

app.use(bodyParser.json())

// Logout requests' info
app.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  if (!(Object.keys(req.body).length === 0 && req.body.constructor === Object)) {
    console.log(req.body)
  }
  next()
})

// Serve static contents
app.use(express.static(path.join(__dirname, './public')))

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.use(historiesRoutes)

app.listen(3000, () => {
  console.log('App started listening on port 3000')
})
