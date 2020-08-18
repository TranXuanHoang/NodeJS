/* Uncomment this block of source code to use mysql2 to work with databases.

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
*/


/* Uncomment this block of source code to use Sequelize to connect and work with MySQL databases.

const Sequelize = require('sequelize')

const sequelize = new Sequelize('online_shopping', 'node_app_user', 'ThePassword', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = sequelize
*/


// Method 1: Connect to MongoDB with the following code snippet
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://node_app_user:2QbSWJVa64KbXe65@experiment.ejqjk.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
    .then(client => {
      console.log('Database Connected!')
      // client is an object which gives the app access to the database
      callback(client)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = mongoConnect


// Method 2: Connect to MongoDB with the following code snippet
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://node_app_user:2QbSWJVa64KbXe65@experiment.ejqjk.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// const mongoConnect = (callback) => {
//   client.connect()
//     .then(client => {
//       console.log('Database Connected!')
//       // client is an object which gives the app access to the database
//       callback(client)
//     })
//     .catch(err => {
//       console.log(err)
//       client.close();
//     });
// }

// module.exports = mongoConnect
