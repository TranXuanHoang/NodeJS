const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
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
    .then(result => {
      console.log(result)
      res.redirect('/')
    })
    .catch(err => console.log(err))
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
