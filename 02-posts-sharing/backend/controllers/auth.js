const User = require('../models/user')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }
  const { email, name, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      password: hashedPassword,
      name
    })
    const result = await user.save()
    res.status(201).json({
      message: 'User created!',
      userId: result._id
    })
  } catch (err) { next(err) }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error('A user with this email could not be found.')
      error.statusCode = 401
      throw error
    }
    const passordsMatch = await bcrypt.compare(password, user.password)
    if (!passordsMatch) {
      const error = new Error('Wrong password!')
      error.statusCode = 401
      throw error
    }

    // Sign the given {email: ..., userId: ...} into a JSON Web Token string payload
    const token = jwt.sign(
      // The payload to sign
      {
        email: user.email,
        userId: user._id.toString()
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
      userId: user._id.toString()
    })
  } catch (err) { next(err) }
}

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('Could not find user status.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({
      message: 'Fetched status successfully',
      status: user.status
    })
  } catch (err) { next(err) }
}

exports.updateUserStatus = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Please specify your status.')
    error.statusCode = 422
    throw error
  }
  try {
    const user = await User.findById(req.userId)
    user.status = req.body.status
    await user.save()
    res.status(200).json({
      message: 'Status updated.',
      status: req.body.status
    })
  } catch (err) { next(err) }
}
