import express from 'express'

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  // Send a HTTP header to tell the client browser to destroy the
  // cookie that contains JSON Web Token used in authentication.
  // https://www.npmjs.com/package/cookie-session#destroying-a-session
  req.session = null

  // NOTE: This signout has a flaw in which any fake cookies sent
  // from client can make him/her signout

  res.send({})
})

export { router as signoutRouter }
