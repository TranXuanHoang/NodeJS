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

  // Method 1: Manually pass in userId when calling Product.create()
  // const userId = req.user.id
  // Product.create({ title, imageUrl, price, description, userId })
  //   .then(result => {
  //     res.redirect('/admin/products')
  //   })
  //   .catch(err => console.log(err))

  // Method 2: Use Sequelize's auto generated User.createProduct()
  // The auto generated method is available when defining association
  // between 'User' and 'Product'
  //     User.hasMany(Product)
  //     Product.belongsTo(User)
  // See: https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances
  req.user.createProduct({ title, imageUrl, price, description })
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
  Product.findByPk(prodId)
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
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description

  // Method 1: Optimistic update (without checking existence)
  // Product.update(
  //   { title, imageUrl, description, price }, {
  //   where: { id: id }
  // }).then(result => {
  //   res.redirect('/admin/products')
  // }).catch(err => console.log(err))

  // Method 2: Deterministic update (check existence first)
  Product.findByPk(id)
    .then(product => {
      product.title = title
      product.imageUrl = imageUrl
      product.price = price
      product.description = description
      return product.save() // save updated product data back to db
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.findAll()
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

  // Method 1: Optimistic delete
  // Product.destroy({
  //   where: { id: productId }
  // })
  //   .then(result => {
  //     res.redirect('/admin/products')
  //   })
  //   .catch(err => console.log(err))

  // Method 2: Deterministic delete
  Product.findByPk(productId)
    .then(product => {
      return product.destroy()
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
