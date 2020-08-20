const util = require('util')
const { ObjectId } = require('mongodb')

const { getDb } = require('../util/database')

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart // {items: []}
    this._id = id
  }

  save() {
    const db = getDb()
    return db.collection('users')
      .insertOne(this)
  }

  addToCart(product) {
    const cartProductIndex = this.cart ?
      this.cart.items.findIndex(cp =>
        cp.productId.toString() === product._id.toString()) : -1
    let newQuantity = 1
    const updatedCartItems = this.cart ? [...this.cart.items] : []

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      })
    }
    const updatedCart = {
      items: updatedCartItems
    }
    const db = getDb()
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    )
  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })
  }
}

module.exports = User
