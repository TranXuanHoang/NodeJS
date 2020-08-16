const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true
  }
})

module.exports = Order
