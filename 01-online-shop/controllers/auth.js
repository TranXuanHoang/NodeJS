const bcrypt = require('bcryptjs')
const sendgridMail = require('@sendgrid/mail')

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
    errorMessage: message
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
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('/login')
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
          req.flash('error', 'Invalid email or password.')
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', `E-Mail '${email}' exists already. Please pick a different one.`)
        return res.redirect('/signup')
      }
      return bcrypt.hash(password, 12)
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
          })
          .then(result => {
            console.log(`After sending a request to send an email to ${email}`)
            console.log(result)
          })
          .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
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
