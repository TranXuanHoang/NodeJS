const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth Controller', () => {
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

  it('should throw an error with code 500 if accessing the database fails', (done) => {
    sinon.stub(User, 'findOne')
    User.findOne.throws()

    const req = {
      body: {
        email: 'test@mail.com',
        password: 'asdfg'
      }
    }
    AuthController.login(req, {}, () => { }).then(result => {
      expect(result).to.be.an('error')
      expect(result).to.have.property('statusCode', 500)

      // Trigger Mocha to wait for this async AuthController.login() finishes
      done()
    })

    User.findOne.restore()
  })

  it('should send a response with a valid user status for an existing user', (done) => {
    const req = { userId: user._id.toString() }
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.userStatus = data.status
      }
    }
    AuthController.getUserStatus(req, res, () => { }).then(() => {
      expect(res.statusCode).to.be.equal(200)
      expect(res.userStatus).to.be.equal('I am new!')
      done()
    })
  })

  // Runs after all test cases
  after((done) => {
    // Clean up created user after asserting test results
    User.deleteMany({})
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
