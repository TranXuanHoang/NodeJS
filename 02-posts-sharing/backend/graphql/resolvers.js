const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Post = require('../models/post')

module.exports = {
  createUser: async ({ userInput }, req) => {
    const { email, name, password } = userInput
    const errors = []
    if (!validator.isEmail(email)) {
      errors.push({ message: 'Email is invalid.' })
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
      errors.push({ message: 'Password too short.' })
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.')
      error.data = errors
      error.code = 422
      throw error
    }
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      const error = new Error('User exists already!')
      throw error
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      name,
      password: hashedPassword
    })
    const createdUser = await user.save()
    return { ...createdUser._doc, _id: createdUser._id.toString() }
  },

  login: async ({ email, password }, req) => {
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error('User not found.')
      error.code = 401
      throw error
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      const error = new Error('Password is incorrect.')
      error.code = 401
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
    return { token, userId: user._id.toString() }
  },

  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated.')
      error.code = 401
      throw error
    }
    const { title, content, imageUrl } = postInput
    const errors = []
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: 'Title is invalid.' })
    }
    if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
      errors.push({ message: 'Content must be at least 5 characters length.' })
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.')
      error.data = errors
      error.code = 422
      throw error
    }
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('Invalid user.')
      error.code = 401
      throw error
    }
    const post = new Post({
      title, content, imageUrl,
      creator: user
    })
    const createdPost = await post.save()
    user.posts.push(createdPost)
    await user.save()
    return result = {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString()
    }
  }
}
