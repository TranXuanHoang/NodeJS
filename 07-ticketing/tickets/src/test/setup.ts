import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      /** A global utility function for signing a user up and getting back an auth cookie */
      signup(credential: { email: string, password: string }): Promise<string[]>
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

global.signup = async (credential) => {
  const response = await request(app)
    .post('/api/users/signup')
    .send(credential)
    .expect(201)

  expect(response.body.email).toEqual(credential.email)

  const cookie = response.get('Set-Cookie')
  return cookie
}
