const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const app = express()

// Define storage for saving uploaded files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`)
  }
})

// Define a filter to accept specific types of uploaded files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'
    || file.mimetype === 'image/jpeg' || file.mimetype === 'image/svg') {
    // Accept file whose type is either png/jpg/jpeg/svg
    cb(null, true)
  } else {
    // Not accept file with other extensions
    cb(null, false)
  }
}

// Parse incoming request body to JSON
// app.use(bodyParser.urlencoded()) // Content-Type: x-www-form-urlencoded
app.use(bodyParser.json()) // Content-Type: application/json

// Parse, filter and save images
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')))

// Config CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
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
app.use('/auth', authRoutes)

// Handle errors
app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({
    message,
    data
  })
})

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
  const server = app.listen(8080)

  // Config socket.io
  const io = require('socket.io')(server)

  // Handle event of connections from clients
  io.on('connection', socket => {
    console.log('Client connected')
    console.log(socket)
  })
}).catch(err => {
  console.log(err)
})
