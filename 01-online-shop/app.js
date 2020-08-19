const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const { mongoConnect } = require('./util/database')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

// Set up EJS as template engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Parse the request body so that the following handlers can directly read the body
app.use(bodyParser.urlencoded({ extended: true }))

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
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user
  //   })
  //   .catch(err => console.log(err))
  //   .finally(() => next())
  next()
})

// Serve static contents
app.use(express.static(path.join(__dirname, 'public')))

// Handle app's routes
app.use('/admin', adminRoutes)
app.use(shopRoutes)

// Handle 404 Not Found
app.use(errorController.get404)

mongoConnect(() => {
  app.listen(3000)
})
