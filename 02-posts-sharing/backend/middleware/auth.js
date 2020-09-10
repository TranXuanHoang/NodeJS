const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(
      token,
      // The same scret key used in
      // ../graphql/resolvers.js > login > jwt.sign()
      'Secret key for signing the payload - Should be a long unguessable string for production-ready app'
    )
  } catch (err) {
    req.isAuth = false
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.userId = decodedToken.userId
  req.isAuth = true
  next()
}
