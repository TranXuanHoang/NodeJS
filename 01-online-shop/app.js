const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

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

// Get user info from database
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user
    })
    .catch(err => console.log(err))
    .finally(() => next())
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
//   FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
// - Updating/deleting 'User' rows will automatically update/delete 'Product' matching rows
// - References:
//     (1) https://sequelize.org/master/manual/assocs.html#one-to-many-relationships
//     (2) https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html#foreign-key-referential-actions
User.hasMany(Product, {
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Product.belongsTo(User)

// - One-To-One relationship between 'User' and 'Cart'
//   (one user has only one cart, a cart belongs to only one user)
// - The foreign key is defined in 'Cart'
//   FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
// - Deleting 'User' rows will automatically set the foreign key column in 'Cart' (userId) to NULL
//   Updating 'User' rows will automatically update the foregign key column in 'Cart' (userId)
// - References:
//     (1) https://sequelize.org/master/manual/assocs.html#one-to-one-relationships
//     (2) https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html#foreign-key-referential-actions
User.hasOne(Cart)
Cart.belongsTo(User)

// - Many-To-Many relationship between 'Cart' and 'Product'
//   (one cart may contain many products, and one product may be added to multiple carts)
// - 'CartItem' will act as a junction model between 'Cart' and 'Product'
//   Sequelize will generate two foreign keys in this 'CartItem' that will reference to
//   corresponding primary keys of 'Cart' and 'Product'
//   FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
//   FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
// - Deleting/Updating rows in 'Cart' and/or 'Product' will automatically delete/update matching rows
//   in 'CartItem'
// - References:
//     (1) https://sequelize.org/master/manual/assocs.html#many-to-many-relationships
//     (2) https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html#foreign-key-referential-actions
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

// - One-To-Many relationship between 'User' and 'Order'
//   (a user may place multiple orders, and each order is created by only one user)
// - The foreign key is defined in 'Order'
//   FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
// - Deleting rows in 'User' will set the 'Order'.'userId' of matching rows in 'Order' to NULL
//   Updating rows in 'User' will automatically update matching rows in 'Order'
User.hasMany(Order)
Order.belongsTo(User)

// - Many-To-Many relationship between 'Order' and 'Product'
//   (An order may contain many products, and a product may appear in multiple orders)
// - 'OrderItem' will act as a junction model having 2 foreign keys referencing to 'Order' and 'Product'
//   FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
//   FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
// - Deleting/Updating rows in 'Cart' and/or 'Product' will automatically delete/update
//   'OrderItem' matching rows
Order.belongsToMany(Product, { through: OrderItem })
Product.belongsToMany(Order, { through: OrderItem })

// Sysc database, and if successful start the app server
sequelize.sync(/*{ force: true }*/)
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Hoang', email: 'test@mail.com' })
    }
    return user
  })
  .then(async user => {
    const cart = await user.getCart()
    if (!cart) {
      return user.createCart()
    }
    return cart
  })
  .then(cart => {
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
