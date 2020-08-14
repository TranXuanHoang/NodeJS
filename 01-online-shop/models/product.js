const { Sequelize, DataTypes } = require('sequelize')

const sequelize = require('../util/database')

// For more information about attributes that can be set for fiels, see:
// https://sequelize.org/master/class/lib/model.js~Model.html#static-method-init
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Product
