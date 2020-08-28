const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const sendgridMail = require('@sendgrid/mail')
const { validationResult } = require('express-validator')

const User = require('../models/user')

// Method 1 for sending emails
// Use a combination of 'nodemailer' and 'nodemailer-sendgrid-transport' as follows
//
// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport')
// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth: {
//     api_key: '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'
//   }
// }));
// transporter.sendMail({
//   to: email,
//   from: 'hoangtx.ict@gmail.com',
//   subject: 'Signup succeeded!',
//   html: '<h1>You successfully signed up!</h1>'
// })

// Method 2 for sending emails
// Use '@sendgrid/mail'
sendgridMail.setApiKey('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')

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  console.log(message)
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
    oldInput: { email: '', password: '' },
    validationErrors: []
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  console.log(message)
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message,
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: []
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array()
    })
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          pageTitle: 'Login',
          path: '/login',
          errorMessage: 'Invalid email or password.',
          oldInput: { email, password },
          validationErrors: [] // Pass an empty array to avoid clearly indicating which field is wrong
        })
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          // Authenticated successfully
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
              // Only redirect after finishing storing session to the database
              // to make sure that the session has been created before navigating
              // to the top page - so that the top page's logic that depends on
              // the session will work as expected.
              res.redirect('/')
            })
          }

          // Not authenticated, redirect to /login again
          return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: 'Invalid email or password.',
            oldInput: { email, password },
            validationErrors: [] // Pass an empty array to avoid clearly indicating which field is wrong
          })
        })
    })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    })
  }
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
      console.log(`Sending email to ${email}`)
      return sendgridMail.send({
        to: email,
        from: 'hoangtx.ict@gmail.com',
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      }).then(result => {
        console.log(`After sending a request to send an email to ${email}`)
        console.log(result)
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

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  console.log(message)
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', `No account with that '${req.body.email}' email found.`)
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 60 /*mins*/ * 60 /*secs*/ * 100 /*ms*/
        return user.save()
      })
      .then(result => {
        res.redirect('/')
        sendgridMail.send({
          to: req.body.email,
          from: 'hoangtx.ict@gmail.com',
          subject: 'Password Reset',
          html: `
            <p>You requested a password reset</p>
            <p>Go to <a href="http://localhost:3000/reset/${token}">this page</a> to set a new password.</p>
          `
        })
          .then(result => {
            console.log(`Sent a password reset guiding email to ${req.body.email}`)
            console.log(`http://localhost:3000/reset/${token}`)
          })
      })
      .catch(err => console.log(err))
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error')
      console.log(message)
      if (message.length > 0) {
        message = message[0]
      } else {
        message = null
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => console.log(err))
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken
  let resetUser

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined
      return resetUser.save()
    })
    .then(result => {
      res.redirect('/login')
    })
    .catch(err => console.log(err))
}
