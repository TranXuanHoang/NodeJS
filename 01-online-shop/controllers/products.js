const products = []

exports.getAddProduct = (req, res) => {
  // Serve add-product.html
  // const rootDir = require('../util/path')
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))

  // Render HTML code from add-product.pug, then send clients with that HTML code
  // res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' })

  // Render HTML code from add-product.hbs, then send clients with that HTML code
  // res.render('add-product', {
  //   pageTitle: 'Add Product',
  //   formsCSS: true,
  //   productCSS: true,
  //   activeAddProduct: true
  // })

  // Render HTML code from add-product.ejs, then send clients with that HTML code
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  })
}

exports.postAddProduct = (req, res) => {
  products.push({ title: req.body.title })
  res.redirect('/')
}

exports.getProducts = (req, res) => {
  // Serve shop.html
  // const rootDir = require('../util/path')
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'))

  // Render HTML code from shop.pug, then send clients with that HTML code
  // res.render('shop', { prods: products, pageTitle: 'Online Shop', path: '/' })

  // Render HTML code from shop.hbs, then send clients with that HTML code
  // res.render('shop', {
  //   prods: products,
  //   pageTitle: 'Online Shop',
  //   productCSS: true,
  //   activeShop: true
  // })

  // Render HTML code from shop.ejs, then send clients with that HTML code
  res.render('shop', {
    pageTitle: 'Online Shop',
    prods: products,
    path: '/'
  })
}
