const express = require('express')
const { body } = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../models/user')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

const USER_LOGIN_DATA_VALIDATORS = [
  body('email').trim()
    .isEmail().withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('Email address already exists!')
        }
      })
    })
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password').trim()
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters length.')
]

const USER_SIGNUP_DATA_VALIDATORS = [
  ...USER_LOGIN_DATA_VALIDATORS,
  body('name').trim()
    .not()
    .isEmpty().withMessage('Please enter a name.')
]

router.put('/signup',
  USER_SIGNUP_DATA_VALIDATORS,
  authController.signup
)

router.post('/login',
  USER_LOGIN_DATA_VALIDATORS,
  authController.login
)

// GET /auth/status
router.get('/status', isAuth, authController.getUserStatus)

// PUT /auth/status/:userId
router.patch('/status',
  isAuth,
  [
    body('status').trim().notEmpty().withMessage('Please provide a status.')
  ],
  authController.updateUserStatus
)

module.exports = router
