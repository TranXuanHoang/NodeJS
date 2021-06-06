import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
  // Connect to MongoDB
  // MongoDB connection uri
  const db_username = 'node_app_user'
  const password = '2QbSWJVa64KbXe65'
  const db_name = 'auth'
  // Note on connection strings
  // 'mongodb+srv://...' might not work, then change to 'mongodb://...'
  // https://docs.mongodb.com/manual/reference/connection-string/
  // https://mongoosejs.com/docs/connections.html
  // https://stackoverflow.com/questions/55499175/how-to-fix-error-querysrv-erefused-when-connecting-to-mongodb-atlas
  const MONGODB_URI = `mongodb+srv://${db_username}:${password}@experiment.ejqjk.mongodb.net/${db_name}?retryWrites=true&w=majority`
  const MONGODB_URI_STANDARD = `mongodb://${db_username}:${password}@experiment-shard-00-00.ejqjk.mongodb.net:27017,experiment-shard-00-01.ejqjk.mongodb.net:27017,experiment-shard-00-02.ejqjk.mongodb.net:27017/${db_name}?ssl=true&replicaSet=atlas-uuxiso-shard-0&authSource=admin&retryWrites=true&w=majority`

  try {
    await mongoose.connect(
      MONGODB_URI_STANDARD,
      { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    )
    console.log('[Backend] Database Connected.')
  } catch (err) {
    console.log(err)
  }

  // Start the app
  const port = process.env.PORT || 3090
  app.listen(port, () => {
    console.log('[Backend] Listening on port', port)
  })
}

start()
