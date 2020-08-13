const Product = require('../models/product')

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
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const product = new Product(null, title, imageUrl, description, price)
  product.save()
  res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit == 'true' // Extract URL's query param ?edit=...
  if (!editMode) {
    res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId, product => {
    if (!product) {
      // This is not a good solution in the view point of UX.
      // Here for simplicity, we just redirect to top page.
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  // Method 1: Update product with static method
  // Product.update(id, title, imageUrl, price, description, updatedProducts => {
  //   res.render('admin/products', {
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products',
  //     prods: updatedProducts
  //   })
  // })

  // Method 2: Mimic postAddProduct()
  const updatedProduct = new Product(id, title, imageUrl, description, price)
  updatedProduct.save()
  res.redirect('/admin/products')
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

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.deleteById(productId, products => {
    // Method 1: Render admin/products view passing products list getting from deleteById
    // res.render('admin/products', {
    //   pageTitle: 'Admin Products',
    //   path: '/admin/products',
    //   prods: products
    // })

    // Method 2: Simply redirect to /admin/products leaving 'GET /admin/products'
    // to retrieve the list of products again
    res.redirect('/admin/products')
  })
}
