const express = require('express')
const { body } = require('express-validator')

const feedController = require('../controllers/feed')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

const POST_DATA_VALIDATORS = [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 })
]

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts)

// POST /feed/post
router.post('/post',
  isAuth,
  POST_DATA_VALIDATORS,
  feedController.createPost
)

// GET /post/:postId
router.get('/post/:postId', isAuth, feedController.getPost)

// PUT /post/:postId
router.put('/post/:postId',
  isAuth,
  POST_DATA_VALIDATORS,
  feedController.updatePost
)

// DETE /post/:postId
router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router
