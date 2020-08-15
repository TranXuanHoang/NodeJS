const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
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
app.use('/admin', adminRoutes)
app.use(shopRoutes)

// Handle 404 Not Found
app.use(errorController.get404)

// Define relations (associations) between database tables
// - One-To-Many relationship exists between 'User' and 'Product'
//   (one user may buy multiple products, one admin may create multiple products)
// - The foreign key is defined in 'Product'
//   FOREIGN KEY (`UserId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
// - Updating/deleting 'User' rows will automatically updating/deleting 'Product' matching rows
User.hasMany(Product, {
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Product.belongsTo(User)


// Sysc database, and if successful start the app server
sequelize.sync({ force: true })
  .then(result => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
