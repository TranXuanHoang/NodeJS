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

  deleteItemFromCart(productId) {
    const db = getDb()
    const updatedCartItems = this.cart.items.filter(
      i => i.productId.toString() !== productId.toString())
    this.cart.items = updatedCartItems
    return db.collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
  }

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map(i => i.productId)
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(
              i => i.productId.toString() === p._id.toString()
            ).quantity
          }
        })
      })
  }

  addOrder() {
    const db = getDb()
    return this.getCart()
      .then(products => {
        if (!products || products.length == 0) {
          // Avoid after creating order, click browser's go back button
          // then click create order again (order without products in cart)
          return false
        }
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name
          },
          createdAt: Date.now()
        }
        return db.collection('orders').insertOne(order)
      })
      .then(result => {
        if (!result) {
          return false
        }
        this.cart = { items: [] }
        return db.collection('users')
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          )
      })
  }

  getOrders() {
    const db = getDb()
    return db.collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray()
  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })
  }
}

module.exports = User
