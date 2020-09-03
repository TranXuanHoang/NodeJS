const express = require('express')
const { body } = require('express-validator')

const feedController = require('../controllers/feed')

const router = express.Router()

const POST_DATA_VALIDATORS = [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 })
]

// GET /feed/posts
router.get('/posts', feedController.getPosts)

// POST /feed/post
router.post('/post',
  POST_DATA_VALIDATORS,
  feedController.createPost
)

// GET /post/:postId
router.get('/post/:postId', feedController.getPost)

// PUT /post/:postId
router.put('/post/:postId',
  POST_DATA_VALIDATORS,
  feedController.updatePost
)

module.exports = router
