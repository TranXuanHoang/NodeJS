const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Post = require('../models/post')
const { clearImage } = require('../util/file')

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
  },

  posts: async ({ page }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated.')
      error.code = 401
      throw error
    }
    if (!page) {
      page = 1
    }
    const perPage = 2
    const totalPosts = await Post.find().countDocuments()
    const posts = await Post.find()
      .sort({ createdAt: 'DESC' })
      .populate('creator')
      .skip((page - 1) * perPage)
      .limit(perPage)

    return {
      posts: posts.map(p => {
        return {
          ...p._doc,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        }
      }),
      totalPosts
    }
  },

  post: async ({ id }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated.')
      error.code = 401
      throw error
    }
    const post = await Post.findById(id).populate('creator')
    if (!post) {
      const error = new Error('Post not found.')
      error.code = 404
      throw error
    }
    return {
      ...post._doc,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }
  },

  updatePost: async ({ id, postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated.')
      error.code = 401
      throw error
    }
    const post = await Post.findById(id).populate('creator')
    if (!post) {
      const error = new Error('No post found!')
      error.code = 404
      throw error
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!')
      error.code = 403
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
    post.title = title
    post.content = content
    if (imageUrl !== 'undefined') {
      post.imageUrl = imageUrl
    }
    const updatedPost = await post.save()
    return {
      ...updatedPost._doc,
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    }
  },

  deletePost: async ({ id }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated.')
      error.code = 401
      throw error
    }
    const post = await Post.findById(id)
    if (!post) {
      const error = new Error('No post found!')
      error.code = 404
      throw error
    }
    if (post.creator.toString() !== req.userId.toString()) {
      // Note that we didn't populate creator in Post.findById(id) above
      // so post.creator is already the ID of the creator
      const error = new Error('Not authorized!')
      error.code = 403
      throw error
    }
    clearImage(post.imageUrl)
    await Post.findByIdAndRemove(id)
    const user = await User.findById(req.userId)
    user.posts.pull(id)
    await user.save()
    return true
  },

  user: async (args, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated.')
      error.code = 401
      throw error
    }
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('Invalid user.')
      error.code = 404
      throw error
    }
    return {
      ...user._doc,
      password: null // avoid leaking password
    }
  },

  updateStatus: async ({ status }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated.')
      error.code = 401
      throw error
    }
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('Invalid user.')
      error.code = 404
      throw error
    }
    user.status = status
    const updatedUser = await user.save()
    return {
      ...updatedUser._doc,
      password: null // avoid leaking password
    }
  }
}
