const { validationResult } = require('express-validator')

const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'Hello',
        content: 'Here is another post',
        imageUrl: 'images/book.png',
        creator: {
          name: 'Hoang'
        },
        createdAt: new Date()
      }
    ]
  })
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Throw an error so that the control flow will reach to the error handler middleware
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422
    throw error
  }
  const { title, content } = req.body
  const post = new Post({
    title,
    content,
    imageUrl: 'images/book.png',
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
