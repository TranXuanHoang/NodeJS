const fs = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')

const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Online Shop',
        path: '/',
        prods: products
      })
    })
    .catch(err => {
      console.log('shop.getIndex failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        prods: products,
        path: '/products'
      })
    })
    .catch(err => {
      console.log('shop.getProducts failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
    .catch(err => {
      console.log('shop.getProduct failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
        products: products
      })
    })
    .catch(err => {
      console.log('shop.getCart failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
    .catch(err => {
      console.log('shop.postAddToCart failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log('shop.postCartDeleteProduct failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
          email: req.user.email,
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
    .catch(err => {
      console.log('shop.postOrder failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getOrders = (req, res, next) => {
  Order
    .find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders
      })
    })
    .catch(err => {
      console.log('shop.getOrders failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'))
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorize'))
      }
      const invoiceName = `invoice-${orderId}.pdf`
      const invoicePath = path.join('data', 'invoices', invoiceName)

      // Generate and stream PDF invoice file
      // See https://pdfkit.org/
      const pdfDoc = new PDFDocument()

      pdfDoc.pipe(fs.createWriteStream(invoicePath)) // save pdf file to server
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)
      pdfDoc.pipe(res) // stream pdf content to client browser

      pdfDoc.fontSize(40).fill('#2E86C1').text('Invoice', {
        underline: true,
      })
      pdfDoc.fontSize(20).fill('black')
        .text('__________________')
        .text(' ')

      pdfDoc.fill('#7B7D7D')
        .text(`Order No: ${order._id}`)
        .text(`Date Time: ${order.createdAt.toLocaleString()}`)
        .text(`To: ${order.user.email}`)
        .fill('black')
        .text(' ')

      let totalPrice = 0
      order.products.forEach(prod => {
        const subtotal = prod.quantity * prod.product.price
        pdfDoc.text(`${prod.product.title} - (${prod.quantity} * $${prod.product.price}) - (Subtotal: $${subtotal}) `)
        totalPrice += subtotal
      })

      pdfDoc
        .text(' ')
        .fontSize(25).fill('#873600')
        .text(`Total: $${totalPrice}`)

      // Finalize PDF file
      pdfDoc.end()

      // Method 1 (Preload file): read the entire file content with fs.readFile()
      //    and return the file to client with res.send().
      //    This is not a good practice as we need memory to
      //    load the entire file before sending it. Small file
      //    is OK, but big files and number of request is big
      //    will lead to bad performance
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err)
      //   }
      //   res.setHeader('Content-Type', 'application/pdf')
      //   // Set the following header to allow user to download invoice when click 'Invoice' link
      //   // res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`)
      //   res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)
      //   res.send(data)
      // })

      // Method 2 (Stream file): Pipe the file content which is read in as a stream of chunk data
      //    to the writable 'res'. The 'res' is then streamed to the client browser
      //    which will read these chunks of file on fly and when done the browser will
      //    assemble them to create the original file. This method is a huge advancetage
      //    because the app will not need to preload the entire file into memory.
      // const file = fs.createReadStream(invoicePath)
      // res.setHeader('Content-Type', 'application/pdf')
      // res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)
      // file.pipe(res)
    })
    .catch(err => {
      console.log('shop.getInvoice failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  })
}
