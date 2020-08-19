const { ObjectId } = require('mongodb')

const { getDb } = require('../util/database')

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    if (id) {
      this._id = new ObjectId(id)
    }
  }

  save() {
    const db = getDb()
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db.collection('products').updateOne(
        { _id: this._id },
        { $set: this }
      )
    } else {
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp
      .then(result => {
        console.log(result)
      })
      .catch(err => console.log(err))
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find().toArray()
      .then(products => {
        return products
      })
      .catch(err => console.log(err))
  }

  static findById(id) {
    const db = getDb()
    return db.collection('products')
      .findOne({ _id: new ObjectId(id) })
      .then(product => {
        return product
      })
      .catch(err => console.log(err))
  }

  static deleteById(id) {
    const db = getDb()
    return db.collection('products')
      .deleteOne({ _id: new ObjectId(id) })
      .then(result => {
        return result
      })
      .catch(err => console.log(err))
  }
}

module.exports = Product
