const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')

const errorController = require('./controllers/error')
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// MongoDB connection uri
const db_username = process.env.MONGO_USER
const password = process.env.MONGO_PASSWORD
const db_name = process.env.MONGO_DEFAULT_DATABASE
const MONGODB_URI = `mongodb+srv://${db_username}:${password}@experiment.ejqjk.mongodb.net/${db_name}?retryWrites=true&w=majority`

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

// Initialize CSRF protection with default saving token secret in req.session
// https://www.npmjs.com/package/csurf
const csrfProtection = csrf()

// Define storage for saving uploaded files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
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

// Set up EJS as template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Set secure response headers with Helmet
// See https://helmetjs.github.io/
app.use(helmet())

// Compress responses including CSS, JavaScript and so on
app.use(compression())

// Parse the request body so that the following handlers can directly read the body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

// Config session
app.use(session({
  // This is the secret used to sign the session ID cookie.
  // Should be a long string in production.
  // https://www.npmjs.com/package/express-session#secret
  secret: 'my screet',

  // Indicates whether to force the session to be saved back to the session store.
  // https://www.npmjs.com/package/express-session#resave
  resave: false,

  // Forces a session that is "uninitialized" to be saved to the store.
  // A session is uninitialized when it is new but not modified.
  // https://www.npmjs.com/package/express-session#saveuninitialized
  saveUninitialized: false,

  // The session store instance - which is a MongoDB database in this app
  // https://www.npmjs.com/package/express-session#store
  store: store
}))

// Config CSRF protection
app.use(csrfProtection)

// Config to save flash messages in the session
// https://www.npmjs.com/package/connect-flash
app.use(flash())

// Logout requests' info
app.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  if (req.method === 'POST') {
    console.log(req.body)
    if (req.file) {
      console.log(req.file)
    }
  }
  next()
})

// Serve static contents
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))

// Set available fields for view templates of every request
app.use((req, res, next) => {
  // Fields (data) of res.locals will be accessible to every view
  // http://expressjs.com/en/api.html#res.locals
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

// Get user info from database
app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      // While the req.session.user is an object that contains only user data,
      // the 'user' here is a Mongoose model containing not just user data,
      // but also auto-generated methods a Mongoose model should have.
      req.user = user
    })
    .catch(err => {
      // Inside async code (like this catch), we shouldn't use
      //     throw new Error(err)   // only use throw in sync code
      // as this will not reach the error handler middleware
      //     app.use((error, req, res, next) => { ...})
      // Instead, use next() like below
      next(new Error(err))
    })
    .finally(() => next())
})

// Handle app's routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

// Handle errors
// https://expressjs.com/en/guide/error-handling.html
app.get('/500', errorController.get500) // 'GET /500 Error'
app.use(errorController.get404) // '404 Page Not Found'
app.use((error, req, res, next) => {
  // Avoid use redirect() as this will lead to an infinite loop of
  // redirecting to /500 when error occurred
  // res.redirect('/500')
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: null
  })
})

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
).then(result => {
  console.log('Database Connected.')
  app.listen(process.env.PORT || 3000)
}).catch(err => {
  console.log(err)
})
