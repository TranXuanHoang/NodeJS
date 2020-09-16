const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

const authMiddleware = require('../middleware/is-auth')

describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    const req = {
      get: (headerName) => {
        return null
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => { }))
      .to.throw('Not autheticated.')
  })

  it('should throw an error if the authorization header is only one string', () => {
    const req = {
      get: (headerName) => {
        return 'xyz'
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => { }))
      .to.throw()
  })

  it('should yield a userId after decoding the token', () => {
    const req = {
      get: (headerName) => {
        return 'Bearer xyz'
      }
    }

    // Replace jwt.verify() function with a stub function
    // and let it return a fake object that has a 'userId' of 'abc'
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({ userId: 'abc' })

    // Call auth middleware which is the function to be tested
    authMiddleware(req, {}, () => { })

    // Assert test results
    expect(req).to.have.property('userId')
    expect(req).to.have.property('userId', 'abc')
    expect(jwt.verify.called).to.be.true // assert that jwt.verify() was called

    // Restore the jwt.verify() to its original veriry() function
    jwt.verify.restore()
  })

  it('should throw an error if the token cannot be verified', () => {
    const req = {
      get: (headerName) => {
        return 'Bearer xyz'
      }
    }
    expect(authMiddleware.bind(this, req, {}, () => { }))
      .to.throw()
  })
})
