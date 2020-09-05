const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    const error = new Error('Not autheticated.')
    error.statusCode = 401
    throw error
  }
  const token = authHeader.split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(
      token,
      // The same scret key used in
      // ../controllers/auth.js jwt.sign()
      'Secret key for signing the payload - Should be a long unguessable string for production-ready app'
    )
  } catch (err) {
    err.statusCode = 500
    throw err
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated')
    error.statusCode = 401
    throw error
  }
  req.userId = decodedToken.userId
  next()
}
