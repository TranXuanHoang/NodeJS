import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

declare global {
  namespace NodeJS {
    interface Global {
      /** A global utility function for signing a user up and getting back an auth cookie */
      signup(credential: { email: string, password: string }): string[]
    }
  }
}

let mongo: MongoMemoryServer

/** Before doing all tests, connect to an in-memory MongoDB */
beforeAll(async () => {
  process.env.JWT_KEY = 'TEST SECRET KEY'
  process.env.NODE_ENV = 'test'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

/** Before each test, delete all existing collections */
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

/** After all tests have done, stop the MongoDB and close connection */
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signup = (credential) => {
  // Build a JWT payload. {id, email}
  const payload = {
    id: 'fake id',
    email: credential.email
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session object {jwt: MY_JWT}
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // Return a string express:sess=BASE64_ENCODED_SESSION
  return [`express:sess=${base64}`]
}
