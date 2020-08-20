const Product = require('../models/product')

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  Product.findById(prodId)
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
  req.user.getCart()
    .then(cart => {
      cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: products,
            totalPrice: 0
          })
        })
        .catch(err => console.log(err))
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
  let fetchedCart
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0]
      // Method 1: use Cart.removeProduct() to delete record from CartItem
      // if (product) {
      //   return fetchedCart.removeProduct(product)
      // }

      // Method 2: call auto-generated product.cartItem.destroy()
      if (product) {
        return product.cartItem.destroy()
      }
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      // Create an order, then copy all products from CartItems to OrderItems
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity }
              return product
            })
          )
        })
        .catch(err => console.log(err))
    })
    .then(order => {
      // Delete all products from cart after order has been made
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  // Eager load orders and their associating products
  // https://sequelize.org/master/manual/eager-loading.html
  req.user.getOrders({ include: Product })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders
      })
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  })
}
