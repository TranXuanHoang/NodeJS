const express = require('express')

const route = express.Router()
const ROOT_ROUTE_SEGMENT = '/admin'

const products = []

route.get('/add-product', (req, res) => {
  res.send(`
    <form method="POST" action="${ROOT_ROUTE_SEGMENT}/add-product">
      <p>
        <input type="text" name="title">
      </p>
      <button type="submit">Add</button>
    </form>
  `)
})

route.post('/add-product', (req, res) => {
  const id = products.length
  const title = req.body.title
  products.push(title)
  res.send({ id, title })
})

module.exports = { route, ROOT_ROUTE_SEGMENT }
