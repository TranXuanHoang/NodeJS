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
  const userId = req.user // another way to write userId = req.user._id

  const product = new Product({ title, price, description, imageUrl, userId })
  product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit == 'true' // Extract URL's query param ?edit=...
  if (!editMode) {
    res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
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
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id
  const title = req.body.title
  const price = req.body.price
  const imageUrl = req.body.imageUrl
  const description = req.body.description

  Product.findById(id)
    .then(product => {
      product.title = title
      product.price = price
      product.description = description
      product.imageUrl = imageUrl
      return product.save()
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    // To get only product's title and price; and relate the userId with User
    // object in which only user's name is fetched use the following 2 methods
    // .select('title price -_id')
    // .populate('userId', 'name')
    //
    // We will get back data in the following form:
    // [
    //   {
    //     title: 'A Book',
    //     price: 19.5,
    //     userId: { _id: 5f3f350a5394a02da09c6139, name: 'Hoang' }
    //   }
    // ]
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        prods: products
      })
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findByIdAndRemove(productId)
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
