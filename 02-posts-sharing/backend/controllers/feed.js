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
  const imageUrl = req.file.path.replace("\\" ,"/")
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
