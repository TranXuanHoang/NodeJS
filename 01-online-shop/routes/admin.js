const express = require('express')

const adminController = require('../controllers/admin')

const route = express.Router()

route.get('/add-product', adminController.getAddProduct)
route.post('/add-product', adminController.postAddProduct)
route.get('/products', adminController.getProducts)

module.exports = route
