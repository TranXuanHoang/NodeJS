const express = require('express')
const { check, body } = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../models/user')

const route = express.Router()

route.get('/login', authController.getLogin)
route.get('/signup', authController.getSignup)

route.post('/login',
  [
    body('email')
      .isEmail().withMessage('Please enter a valid email')
      .normalizeEmail({ gmail_remove_dots: false }),
    body('password', 'Please enter a valid password.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
)

route.post('/signup',
  [
    check('email').isEmail().withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              // throw new Error(`E-Mail '${value}' exists already. Please pick a different one.`)
              return Promise.reject(`E-Mail '${value}' exists already. Please pick a different one.`)
            }
          })
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!')
        }
        return true
      })
  ],
  authController.postSignup
)

route.post('/logout', authController.postLogout)
route.get('/reset', authController.getReset)
route.post('/reset', authController.postReset)
route.get('/reset/:token', authController.getNewPassword)
route.post('/new-password', authController.postNewPassword)

module.exports = route
