const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator')

const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'Fetched posts successfully',
        posts
      })
    })
    .catch(err => next(err))
}

exports.createPost = (req, res, next) => {
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
    creator: {
      name: 'Hoang'
    }
  })
  post.save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Post created successfully',
        post: result
      })
    })
    .catch(err => {
      // Set error status code and pass it to the error handler middleware
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getPost = (req, res, next) => {
  const postId = req.params.postId
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.')
        error.statusCode = 404
        throw error
      }
      res.status(200).json({
        message: 'Post fetched',
        post
      })
    })
    .catch(err => next(err))
}

exports.updatePost = (req, res, next) => {
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
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.')
        error.statusCode = 404
        throw error
      }
      // Delete old image if a new one was uploaded
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl)
      }

      // Update post data in the database
      post.title = title
      post.imageUrl = imageUrl
      post.content = content
      return post.save()
    })
    .then(result => {
      res.status(200).json({
        message: 'Post updated!',
        post: result
      })
    })
    .catch(err => next(err))
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
