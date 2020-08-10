const express = require('express')
const bodyParser = require('body-parser')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  if (req.method === 'POST') {
    console.log(req.body)
  }
  next()
})

app.use(adminRoutes.ROOT_ROUTE_SEGMENT, adminRoutes.route)
app.use(shopRoutes)

app.use((req, res, next) => {
  res.status(404).send('<h1>Page Not Found</h1>')
})

app.listen(3000)
