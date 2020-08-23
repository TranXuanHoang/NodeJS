const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Online Shop',
        path: '/',
        prods: products,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        prods: products,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: `${product.title} | Details`,
        path: '/products',
        product: product,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .execPopulate() // populate() doesn't return a Promise, execPopulate() returns a Promise
    .then(user => {
      console.log(user.cart.items)
      const products = user.cart.items
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products,
        totalPrice: 0,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart.items)
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      })
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products
      })
      return order.save()
    })
    .then(result => {
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order
    .find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuthenticated: req.session.isLoggedIn
  })
}
