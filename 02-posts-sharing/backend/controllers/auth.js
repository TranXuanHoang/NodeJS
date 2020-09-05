const User = require('../models/user')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }
  const { email, name, password } = req.body
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        name
      })
      return user.save()
    })
    .then(result => {
      res.status(201).json({
        message: 'User created!',
        userId: result._id
      })
    })
    .catch(err => next(err))
}

exports.login = (req, res, next) => {
  const { email, password } = req.body
  let loadedUser
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.')
        error.statusCode = 401
        throw error
      }
      loadedUser = user
      return bcrypt.compare(password, user.password)
    })
    .then(passordsMatch => {
      if (!passordsMatch) {
        const error = new Error('Wrong password!')
        error.statusCode = 401
        throw error
      }

      // Sign the given {email: ..., userId: ...} into a JSON Web Token string payload
      const token = jwt.sign(
        // The payload to sign
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
          // Shouldn't include password here
        },
        // Secret key for signing the payload
        'Secret key for signing the payload - Should be a long unguessable string for production-ready app',
        // Other options
        {
          expiresIn: '1h'
        }
      )
      res.status(200).json({
        token,
        userId: loadedUser._id.toString()
      })
    })
    .catch(err => next(err))
}
