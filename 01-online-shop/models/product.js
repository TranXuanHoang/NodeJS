const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
)

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([])
    } else {
      try {
        cb(JSON.parse(fileContent))
      } catch (e) {
        // Catch error when the JSON file content is not in JSON format
        cb([])
      }
    }
  })
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        // Update product
        const existingProductIndex = products.findIndex(prod => prod.id === this.id)
        const updatedProducts = [...products]
        updatedProducts[existingProductIndex] = this
        fs.writeFile(
          p,
          JSON.stringify(updatedProducts, '', 2),
          err => console.log(err)
        )
      } else {
        // Add new product
        this.id = Math.random().toString()
        products.push(this)
        fs.writeFile(
          p,
          JSON.stringify(products, '', 2),
          err => console.log(err)
        )
      }
    })
  }

  /**
   * Fetchs all products data.
   * @param {callback} cb - a callback function called with file content
   *  in JSON format passed in.
   */
  static fetchAll(cb) {
    getProductsFromFile(cb)
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id)
      cb(product)
    })
  }

  static update(id, title, imageUrl, price, description, cb) {
    getProductsFromFile(products => {
      const updatedProducts = products.map(product => {
        if (product.id !== id) {
          return product
        }
        const updatedProduct = { ...product }
        updatedProduct.title = title
        updatedProduct.imageUrl = imageUrl
        updatedProduct.price = price
        updatedProduct.description = description
        return updatedProduct
      })
      fs.writeFile(
        p,
        JSON.stringify(updatedProducts, '', 2),
        err => console.log(err)
      )
      cb(updatedProducts)
    })
  }
}
