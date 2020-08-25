const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const errorController = require('./controllers/error')
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// MongoDB connection uri
const db_username = 'node_app_user'
const password = '2QbSWJVa64KbXe65'
const db_name = 'online_shop'
const MONGODB_URI = `mongodb+srv://${db_username}:${password}@experiment.ejqjk.mongodb.net/${db_name}?retryWrites=true&w=majority`

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

// Initialize CSRF protection with default saving token secret in req.session
// https://www.npmjs.com/package/csurf
const csrfProtection = csrf()

// Set up EJS as template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Parse the request body so that the following handlers can directly read the body
app.use(bodyParser.urlencoded({ extended: true }))

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
  }
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
    .catch(err => console.log(err))
    .finally(() => next())
})

// Set available fields for view templates of every request
app.use((req, res, next) => {
  // Fields (data) of res.locals will be accessible to every view
  // http://expressjs.com/en/api.html#res.locals
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

// Serve static contents
app.use(express.static(path.join(__dirname, 'public')))

// Handle app's routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

// Handle 404 Not Found
app.use(errorController.get404)

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
).then(result => {
  console.log('Database Connected.')
  app.listen(3000)
}).catch(err => {
  console.log(err)
})
