const { DataTypes } = require('sequelize')

const sequelize = require('../util/database')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = User
