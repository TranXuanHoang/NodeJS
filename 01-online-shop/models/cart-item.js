const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
})

module.exports = CartItem
