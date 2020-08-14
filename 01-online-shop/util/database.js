const mysql = require('mysql2')

// Create a pool of connections so that can handle multiple queries
// simutaniously (each query requires a connnection).
// See ../database/online_shopping_database.sql file for instructions
// on steps to prepare the database and user/password.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'node_app_user',
  database: 'online_shopping',
  password: 'ThePassword'
})

// Export promise() to allow us to write SQL queries asynchronous code using
// async chains (that are more structured) instead of using nested callbacks
module.exports = pool.promise()
