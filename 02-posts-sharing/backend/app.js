const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const { graphqlHTTP } = require('express-graphql')

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')
const auth = require('./middleware/auth')
const { clearImage } = require('./util/file')

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

// Log the request information for debugging purpose
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  if (!(Object.keys(req.body).length === 0 && req.body.constructor === Object)) {
    console.log(req.body)
  }
  next()
})

// Check if user is authenticated but will not stop requests going
// to the next middleware which is graphqlHTTP. This lets the graphql
// resolver decide whether to proceed specific logic based on req.isAuth
// status - which is set with the 'auth' middleware here.
app.use(auth)

// Handle file uploads - files are sent to the server and saved in
// the server hard disk by Multer. File uploads are made as REST requests
// and be responded with the path of the location where the file is saved.
// Then pass this path to GraphQL API when creating/updating posts.
app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated.')
  }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided.' })
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath)
  }
  return res.status(201).json({
    message: 'File stored.',
    filePath: req.file.path.replace('\\', '/')
  })
})

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn: err => {
    if (!err.originalError) {
      return err
    }
    const data = err.originalError.data
    const message = err.message || 'An error occurred'
    const code = err.originalError.code || 500
    return { message, status: code, data }
  }
}))

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
  app.listen(8080)
}).catch(err => {
  console.log(err)
})
