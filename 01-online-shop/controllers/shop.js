const Product = require('../modules/product')

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      pageTitle: 'Online Shop',
      path: '/',
      prods: products
    })
  })
}

exports.getProducts = (req, res) => {
  // Serve shop.html
  // const rootDir = require('../util/path')
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))

  // Render HTML code from shop.pug, then send clients with that HTML code
  // res.render('shop', { prods: products, pageTitle: 'Online Shop', path: '/' })

  // Render HTML code from shop.hbs, then send clients with that HTML code
  // res.render('shop', {
  //   prods: products,
  //   pageTitle: 'Online Shop',
  //   productCSS: true,
  //   activeShop: true
  // })

  Product.fetchAll(products => {
    // Render HTML code from shop.ejs, then send clients with that HTML code
    res.render('shop/product-list', {
      pageTitle: 'All Products',
      prods: products,
      path: '/products'
    })
  })
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart'
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  })
}
