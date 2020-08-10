const path = require('path')

const express = require('express')

const rootDir = require('../util/path')

const route = express.Router()

route.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'))
})

module.exports = route
