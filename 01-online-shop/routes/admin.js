const express = require('express')
const { body } = require('express-validator')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const route = express.Router()

const PRODUCT_DATA_VALIDATOR = [
  body('title')
    .trim()
    .notEmpty().withMessage('Please provide a title.')
    .isString().withMessage('Title should be a string.')
    .isLength({ min: 3 }).withMessage('Please enter a title with at least 3 characters.'),
  body('imageUrl', 'Please enter a valid image ULR.')
    .trim()
    .isURL(),
  body('price')
    .notEmpty().withMessage('Please specify price.')
    .custom((value, { req }) => {
      if (+value < 0) {
        throw new Error('Price must be greater than or equal to 0.')
      }
      return true
    }),
  body('description')
    .trim()
    .notEmpty().withMessage('Please provide a description.')
    .isLength({ min: 3, max: 400 })
    .withMessage('Description\'s length must be at least 3 and at most 400 characters.')
]

route.get('/add-product', isAuth, adminController.getAddProduct)

route.post('/add-product', isAuth,
  PRODUCT_DATA_VALIDATOR,
  adminController.postAddProduct
)

route.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

route.post('/edit-product', isAuth,
  PRODUCT_DATA_VALIDATOR,
  adminController.postEditProduct
)

route.post('/delete-product', isAuth, adminController.postDeleteProduct)
route.get('/products', isAuth, adminController.getProducts)

module.exports = route
