const express = require('express')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const route = express.Router()

route.get('/add-product', isAuth, adminController.getAddProduct)
route.post('/add-product', isAuth, adminController.postAddProduct)
route.get('/edit-product/:productId', isAuth, adminController.getEditProduct)
route.post('/edit-product', isAuth, adminController.postEditProduct)
route.post('/delete-product', isAuth, adminController.postDeleteProduct)
route.get('/products', isAuth, adminController.getProducts)

module.exports = route
