const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const adminData = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

// Set up Pug as template engine
// app.set('view engine', 'pug')
// app.set('views', 'views')

// Set up Handlebars as template engine
// const exphbs = require('express-handlebars')
// app.engine('hbs', exphbs({
//   layoutsDir: 'views/layouts',
//   defaultLayout: 'main-layout',
//   extname: 'hbs'
// }))
// app.set('view engine', 'hbs')
// app.set('views', 'views')

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

// Serve static contents
app.use(express.static(path.join(__dirname, 'public')))

// Handle app's routes
app.use(adminData.ROOT_ROUTE_SEGMENT, adminData.routes)
app.use(shopRoutes)

// Handle 404 Not Found
app.use((req, res, next) => {
  // Serve 404.html
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))

  // Render HTML code from either 404.pug or 404.hbs
  // (depending on template engine used), then send clients that HTML code
  // res.status(404).render('404', { pageTitle: 'Page Not Found' })

  // Render HTML code from 404.ejs, then send clients that HTML code
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: null
  })
})

app.listen(3000)
