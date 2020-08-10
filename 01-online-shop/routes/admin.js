const path = require('path')

const express = require('express')

const route = express.Router()
const ROOT_ROUTE_SEGMENT = '/admin'

const products = []

route.get('/add-product', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'))
})

route.post('/add-product', (req, res) => {
  const id = products.length
  const title = req.body.title
  products.push(title)
  res.send({ id, title })
})

module.exports = { route, ROOT_ROUTE_SEGMENT }
