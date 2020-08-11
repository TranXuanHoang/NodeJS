const path = require('path')

const express = require('express')

const rootDir = require('../util/path')
const adminData = require('./admin')

const route = express.Router()

route.get('/', (req, res) => {
  // Serve shop.html
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))

  const products = adminData.products

  // Render HTML code from shop.pug, then send clients with that HTML code
  // res.render('shop', { prods: products, pageTitle: 'Online Shop', path: '/' })

  // Render HTML code from shop.hbs, then send clients with that HTML code
  res.render('shop', { layout: false, prods: products, pageTitle: 'Online Shop', path: '/' })
})

module.exports = route
