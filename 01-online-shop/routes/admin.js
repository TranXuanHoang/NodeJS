const path = require('path')

const express = require('express')

const rootDir = require('../util/path')

const route = express.Router()
const ROOT_ROUTE_SEGMENT = '/admin'

const products = []

route.get('/add-product', (req, res) => {
  // Serve add-product.html
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))

  // Render HTML code from add-product.pug, then send clients with that HTML code
  res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' })
})

route.post('/add-product', (req, res) => {
  products.push({ title: req.body.title })
  res.redirect('/')
})

module.exports = { routes: route, ROOT_ROUTE_SEGMENT, products }
