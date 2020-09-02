exports.getPosts = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        title: 'Hello',
        content: 'Here is another post'
      }
    ]
  })
}

exports.createPost = (req, res, next) => {
  const { title, content } = req.body
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully',
    post: { id: new Date().toISOString(), title, content }
  })
}
