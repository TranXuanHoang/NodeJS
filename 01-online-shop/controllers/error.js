exports.get404 = (req, res, next) => {
  // Serve 404.html
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))

  // Render HTML code from either 404.pug or 404.hbs
  // (depending on template engine used), then send clients that HTML code
  // res.status(404).render('404', { pageTitle: 'Page Not Found' })

  // Render HTML code from 404.ejs, then send clients that HTML code
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: null
  })
}

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: null
  })
}
