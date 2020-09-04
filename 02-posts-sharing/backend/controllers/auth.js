const User = require('../models/user')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

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
