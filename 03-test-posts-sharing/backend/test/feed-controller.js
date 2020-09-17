const expect = require('chai').expect
const mongoose = require('mongoose')

const User = require('../models/user')
const Post = require('../models/post')
const FeedController = require('../controllers/feed')

describe('Feed Controller', () => {
  let user

  // Runs before all test cases and run only one time
  before((done) => {
    // MongoDB connection uri
    const db_username = 'node_app_user'
    const password = '2QbSWJVa64KbXe65'
    const db_name = 'test_posts_sharing' // use test database not 'post_sharing' production database
    const MONGODB_URI = `mongodb+srv://${db_username}:${password}@experiment.ejqjk.mongodb.net/${db_name}?retryWrites=true&w=majority`

    mongoose.connect(
      MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    ).then(result => {
      console.log('Test Database Connected.')
      user = new User({
        email: 'test@mail.com',
        password: 'asdfg',
        name: 'Test',
        posts: []
      })
      return user.save()
    }).then(() => done())
  })

  it('should add a created post to the posts array of the creator', (done) => {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'images/test.png'
      },
      userId: user._id
    }
    const res = {
      status: function () {
        return this // so that res.status().json() will work
      },
      json: () => { }
    }

    FeedController.createPost(req, res, () => { }).then((savedUser) => {
      expect(savedUser).to.have.property('posts')
      expect(savedUser.posts).to.have.length(1)
      expect(savedUser.posts[0].creator.toString()).to.equal(user._id.toString())
      done()
    })
  })

  // Runs after all test cases
  after((done) => {
    // Clean up created posts and user after asserting test results
    Post.deleteMany({})
      .then(() => {
        return User.deleteMany({})
      })
      .then(() => {
        // Close database connection after finishing test
        return mongoose.disconnect()
      })
      .then(() => {
        // Ask Mocha to wait for the async testing done
        done()
      })
  })
})
