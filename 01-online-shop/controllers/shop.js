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

exports.postAddToCard = (req, res, next) => {
  const prodId = req.body.productId
  let fetchedCart;
  let newQuantity = 1
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0]
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity
        newQuantity = oldQuantity + 1
        return product
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      // Cart.addProduct() will decide whether to INSERT or UPDATE CartItem model (CartItems table)
      // INSERT INTO `cartItems` (`id`,`quantity`,`createdAt`,`updatedAt`,`cartId`,`productId`) VALUES (NULL,?,?,?,?,?);
      // UPDATE `cartItems` SET `quantity`=?,`updatedAt`=? WHERE `cartId` = ? AND `productId` = ?
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => {
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
      console.log(`Delete result: ${result}`)
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
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
