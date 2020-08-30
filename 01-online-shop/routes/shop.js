const express = require('express')

const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const route = express.Router()

route.get('/', shopController.getIndex)
route.get('/products', shopController.getProducts)
route.get('/products/:productId', shopController.getProduct)
route.get('/cart', isAuth, shopController.getCart)
route.post('/cart', isAuth, shopController.postAddToCart)
route.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)
route.post('/create-order', isAuth, shopController.postOrder)
route.get('/orders', isAuth, shopController.getOrders)
route.get('/orders/:orderId', isAuth, shopController.getInvoice)
// route.get('/checkout', shopController.getCheckout)

module.exports = route
