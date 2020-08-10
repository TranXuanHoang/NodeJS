const express = require('express')

const route = express.Router()

const products = []

route.get('/add-product', (req, res) => {
  res.send(`
    <form method="POST" action="/product">
      <p>
        <input type="text" name="title">
      </p>
      <button type="submit">Add</button>
    </form>
  `)
})

route.post('/product', (req, res) => {
  console.log(req.body)
  const id = products.length
  const title = req.body.title
  products.push(title)
  res.send({ id, title })
})

module.exports = route
