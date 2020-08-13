const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        try {
          cart = JSON.parse(fileContent)
        } catch (e) { }
      }
      // Find if there exists the same product already, then increase its quantity
      // Otherwise, add a new product to cart
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
      if (existingProductIndex >= 0) {
        const existingProduct = cart.products[existingProductIndex]
        const updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        const newProduct = { id, qty: 1 }
        cart.products = [...cart.products, newProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      // Save cart data to file
      fs.writeFile(
        p,
        JSON.stringify(cart, '', 2),
        err => console.log(err)
      )
    })
  }
}
