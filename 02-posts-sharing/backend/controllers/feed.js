const { validationResult } = require('express-validator')

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
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      imageUrl: 'images/book.png',
      creator: {
        name: 'Hoang'
      },
      createdAt: new Date()
    }
  })
}
