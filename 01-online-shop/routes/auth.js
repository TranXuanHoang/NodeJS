const express = require('express')

const authController = require('../controllers/auth')

const route = express.Router()

route.get('/login', authController.getLogin)
route.get('/signup', authController.getSignup)
route.post('/login', authController.postLogin)
route.post('/signup', authController.postSignup)
route.post('/logout', authController.postLogout)
route.get('/reset', authController.getReset)
route.post('/reset', authController.postReset)

module.exports = route
