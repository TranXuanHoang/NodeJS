const Product = require('../modules/product')

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
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  })
}

exports.postAddProduct = (req, res) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const product = new Product(title, imageUrl, description, price)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      prods: products
    })
  })
}
