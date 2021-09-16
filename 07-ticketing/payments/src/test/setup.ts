import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

declare global {
  namespace NodeJS {
    interface Global {
      /** A global utility function for signing a user up and getting back
       * - an auth session that will be set as a cookie in the header of HTTP requests
       * - and a userId */
      signup(credential: { email: string, password: string })
        : { authSession: string[], userId: string }
    }
  }
}

// May need to change the above code snippet to the following one
// to avoid a TS error like
//   "Element implicitly has an 'any' type because type
//   'typeof globalThis' has no index signature.ts(7017)"
// This is caused by a recent change in the @types/node library
// which is a dependency of ts-node-dev.
// declare global {
//   /** A global utility function for signing a user up and getting back
//    * - an auth session that will be set as a cookie in the header of HTTP requests
//    * - and a userId */
//   var signup: (credential: { email: string, password: string }) =>
//     { authSession: string[], userId: string }
// }

// Mock the '../nats-wrapper' with the '../__mocks__/nats-wrapper.ts'
jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51IreSzAZMJkkVU2ZNCepEDfdThhQ2jr43XA0CSgfDYOTx6yDWC9bEmjjkwJMdREEmVH9sFjNtJYLWwBvAOmmeQuU001su5ZQvF'

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
  // This will clear nat-wrapper mock
  jest.clearAllMocks()

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
    id: new mongoose.Types.ObjectId().toHexString(),
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

  // Return an object containing an array of only one string in the form
  // express:sess=BASE64_ENCODED_SESSION
  // and the signed-up userId
  return {
    authSession: [`express:sess=${base64}`],
    userId: payload.id
  }
}
