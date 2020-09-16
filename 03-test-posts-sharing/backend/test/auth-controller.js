const expect = require('chai').expect
const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth Controller - Login', () => {
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
})
