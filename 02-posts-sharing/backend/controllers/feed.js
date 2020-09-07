const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator')

const io = require('../socket')
const Post = require('../models/post')
const User = require('../models/user')

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1
  const perPage = 3

  try {
    // Count the total number of posts
    const totalItems = await Post.find().countDocuments()

    // Fetch posts while paginating post items
    const posts = await Post.find()
      .populate('creator')
      .sort({createdAt: 'desc'})
      .skip((currentPage - 1) * perPage)
      .limit(perPage)

    res.status(200).json({
      message: 'Fetched posts successfully',
      posts,
      totalItems
    })
  }
  catch (err) { next(err) }
}

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Throw an error so that the control flow will reach to the error handler middleware
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422
    throw error
  }

  // Check if an image file was not uploaded
  if (!req.file) {
    const error = new Error('No image provided')
    error.statusCode = 422
    throw error
  }

  const { title, content } = req.body
  const imageUrl = req.file.path.replace('\\', '/')
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId
  })
  try {
    await post.save()
    const creator = await User.findById(req.userId)
    creator.posts.push(post)
    await creator.save()
    io.getIO().emit('posts', {
      action: 'create',
      post: {
        ...post._doc,
        creator: {
          _id: req.userId,
          name: creator.name
        }
      }
    })
    res.status(201).json({
      message: 'Post created successfully',
      post: post,
      creator: { _id: creator._id, name: creator.name }
    })
  } catch (err) { next(err) }
}

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({
      message: 'Post fetched',
      post
    })
  }
  catch (err) { next(err) }
}

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Throw an error so that the control flow will reach to the error handler middleware
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422
    throw error
  }
  const postId = req.params.postId
  const { title, content } = req.body
  let imageUrl = req.body.image
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/')
  }
  if (!imageUrl) {
    const error = new Error('No file picked.')
    error.statusCode = 422
    throw error
  }
  try {
    const post = await Post.findById(postId).populate('creator')
    if (!post) {
      const error = new Error('Could not find post.')
      error.statusCode = 404
      throw error
    }
    // Check whether the user is allowed the update (authorization)
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized.')
      error.statusCode = 403
      throw error
    }

    // Delete old image if a new one was uploaded
    // and imageUrl is not a string of 'undefined' - which is the case of updating
    // a post without changing its image
    if (imageUrl !== post.imageUrl && imageUrl != 'undefined') {
      clearImage(post.imageUrl)
    }

    // Update post data in the database
    post.title = title
    if (imageUrl != 'undefined') {
      post.imageUrl = imageUrl
    }
    post.content = content
    const result = await post.save()
    io.getIO().emit('posts', {
      action: 'update',
      post: {
        ...result._doc,
        // Avoid sending creator's email and password
        creator: {
          _id: result.creator._id,
          name: result.creator.name
        }
      }
    })
    res.status(200).json({
      message: 'Post updated!',
      post: {
        ...result._doc,
        // Avoid sending creator's email and password
        creator: {
          _id: result.creator._id,
          name: result.creator.name
        }
      }
    })
  } catch (err) { next(err) }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post.')
      error.statusCode = 404
      throw error
    }
    // Check whether the user is allowed the delete (authorization)
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized.')
      error.statusCode = 403
      throw error
    }
    // Delete post image
    clearImage(post.imageUrl)
    await Post.findByIdAndRemove(postId)
    // Delete element from User.posts that has the same id as postId
    const user = await User.findById(req.userId)
    user.posts.pull(postId)
    await user.save()
    res.status(200).json({
      message: 'Deleted post.'
    })
  } catch (err) { next(err) }
}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => {
    if (err) {
      console.log(err)
    }
    console.log(`Deleted ${filePath}`)
  })
}
