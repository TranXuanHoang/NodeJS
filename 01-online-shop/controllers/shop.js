const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Online Shop',
        path: '/',
        prods: products
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.findAll({ attributes: ['id', 'title', 'imageUrl', 'price', 'description'] })
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        prods: products,
        path: '/products'
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: `${product.title} | Details`,
        path: '/products',
        product: product
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    if (cart === null) {
      return res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: [],
        totalPrice: 0
      })
    }

    Product.fetchAll(products => {
      const cartProducts = cart.products.map(cartProduct => {
        const product = products.find(prod => prod.id === cartProduct.id)
        return { productData: product, qty: cartProduct.qty }
      })
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts,
        totalPrice: cart.totalPrice
      })
    })
  })
}

exports.postAddToCard = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)

    // Note that, should call redirect as a callback of addProduct
    res.redirect('/cart')
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart')
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
