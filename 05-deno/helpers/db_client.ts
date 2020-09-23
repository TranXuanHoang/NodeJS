import { MongoClient, Database } from 'https://deno.land/x/mongo@v0.12.1/mod.ts'

// MongoDB connection uri
const db_username = 'node_app_user'
const password = '2QbSWJVa64KbXe65'
const db_name = 'tasks'
const MONGODB_URI = `mongodb+srv://${db_username}:${password}@experiment.ejqjk.mongodb.net/?retryWrites=true&w=majority`

let db: Database

export function connect() {
  const client = new MongoClient()
  client.connectWithUri(MONGODB_URI)

  db = client.database(db_name)
}

export function getDb() {
  return db
}
