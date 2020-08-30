const { validationResult } = require('express-validator')

const Product = require('../models/product')
const fileHelper = require('../util/file')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: undefined,
    product: { title: '', imageUrl: '', price: undefined, description: '' },
    validationErrors: []
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const image = req.file
  const price = req.body.price
  const description = req.body.description
  const userId = req.user // another way to write userId = req.user._id

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not an allowed image.',
      product: { title, price, description },
      validationErrors: []
    })
  }

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: { title, price, description },
      validationErrors: errors.array()
    })
  }

  const imageUrl = image.path
  const product = new Product({ title, price, description, imageUrl, userId })
  product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log('admin.postAddProduct failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
        product: product,
        hasError: false,
        errorMessage: undefined,
        validationErrors: []
      })
    })
    .catch(err => {
      console.log('admin.getEditProduct failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id
  const title = req.body.title
  const price = req.body.price
  const image = req.file
  const description = req.body.description

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title, price, description,
        _id: id // Need to pass product._id for editing form
      },
      validationErrors: errors.array()
    })
  }

  Product.findById(id)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = title
      product.price = price
      product.description = description
      if (image) {
        // Delete the current image
        fileHelper.deleteFile(product.imageUrl)

        // Set imageUrl to the new image's path
        product.imageUrl = image.path
      }
      return product.save()
        .then(result => {
          res.redirect('/admin/products')
        })
    })
    .catch(err => {
      console.log('admin.postEditProduct failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
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
    .catch(err => {
      console.log('admin.getProducts failed')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found!'))
      }
      // Delete product image file
      fileHelper.deleteFile(product.imageUrl)

      // Delete product data from 'products' collection in the database
      return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
    .then(result => {
      // res.redirect('/admin/products')
      res.status(200).json({
        message: 'Success!'
      })
    })
    .catch(err => {
      console.log('admin.postDeleteProduct failed')
      // const error = new Error(err)
      // error.httpStatusCode = 500
      // return next(error)
      res.status(500).json({
        message: 'Deleting product failed.'
      })
    })
}
