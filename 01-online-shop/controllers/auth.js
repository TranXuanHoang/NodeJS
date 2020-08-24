const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  User.findById('5f3f350a5394a02da09c6139')
    .then(user => {
      if (email === user.email) {
        // Authenticated successfully
        req.session.isLoggedIn = true
        req.session.user = user
      } else {
        // Not authenticated
        req.session.isLoggedIn = false
        req.session.user = null
      }
      req.session.save(err => {
        // Only redirect after finishing storing session to the database
        // to make sure that the session has been created before navigating
        // to the top page - so that the top page's logic that depends on
        // the session will work as expected.
        res.redirect('/')
      })
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  // Delete the current session from the 'sessions' collection
  // in the database, then redirect to the '/' top page
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}
