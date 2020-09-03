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
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    })
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
    .catch(err => console.log(err))
}
