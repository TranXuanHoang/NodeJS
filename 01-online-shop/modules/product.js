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
  constructor(title) {
    this.title = title
  }

  save() {
    getProductsFromFile(products => {
      products.push(this)
      fs.writeFile(
        p,
        JSON.stringify(products, '', 2),
        err => console.log(err)
      )
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
}
