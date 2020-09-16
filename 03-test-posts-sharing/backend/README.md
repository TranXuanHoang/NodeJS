# Back-End APIs

[![Written In](https://img.shields.io/badge/Written%20in-Node.js-026e00?style=flat&logo=Node.js)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/Framework-Express.js-FA8072?style=flat)](https://expressjs.com/)
[![Test Framework](https://img.shields.io/badge/Test%20Framework-Mocha-8D6748?style=flat&logo=Mocha)](https://mochajs.org/)
[![Test Assertion Library](https://img.shields.io/badge/Test%20Assertion%20Library-Chai-8D6748?style=flat)](https://www.chaijs.com/)

This back-end app provides APIs for the [post sharing application](../). It will serve data and authentication services to the [frontend](../frontend) app (written in [`React`](https://reactjs.org/)).

## 3rd-Party Packages

The app uses the following 3rd-party packages

| Package | Type | Purpose |
|---------|------|---------|
| [express](https://www.npmjs.com/package/express) | `production` | Provide a web framework while using [Node.js](https://nodejs.org/) |
| [body-parser](https://www.npmjs.com/package/body-parser) | `production` | Parse incoming request bodies in a middleware before the request handlers |
| [nodemon](https://www.npmjs.com/package/nodemon) | `dev` | Auto reload app when making any changes to source code |
| [express-validator](https://www.npmjs.com/package/express-validator) | `production` | [`Homepage`](https://express-validator.github.io/) Validate and sanitize user inputs |
| [mongoose](https://www.npmjs.com/package/mongoose) | `production` | [`Homepage`](https://mongoosejs.com/) Model app data and handle boilerplate queries and logic code when working with [MongoDB](https://www.mongodb.com/) - usually refered as `ODM` _Object Document Modeling_. |
| [multer](https://www.npmjs.com/package/multer) | `production` | Handle forms whose `enctype` is `multipart/form-data` which is primarily used in file uploading |
| [uuid](https://www.npmjs.com/package/uuid) | `production` | Generate [`Universally Unique IDentifier (UUID)`](https://www.ietf.org/rfc/rfc4122.txt) that can be used in naming uploaded image files |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | `production` | Hash passwords using the widely supported [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | `production` | Generate [JSON Web Tokens](https://jwt.io/introduction/) ([RFC-7519](https://tools.ietf.org/html/rfc7519)) when logging in users - the tokens are used to authenticate REST API requests |
| [mocha](https://www.npmjs.com/package/mocha) | `dev` | [`Homepage`](https://mochajs.org/) Make asynchronous testing of Node.js apps simple |
| [chai](https://www.npmjs.com/package/chai) | `dev` | [`Homepage`](https://www.chaijs.com/) Assert test suites for Node.js apps |
| [sinon](https://www.npmjs.com/package/sinon) | `dev` | [`Homepage`](https://sinonjs.org/) Create standalone test spies, stubs and mocks to make testing JavaScript code easier |

## Run App

To start the app on a local machine:

* Change working directory of your terminal to `backend`
* Install npm packages `npm install`
* Run app with `npm start`

For automated testing

* Run `npm test` to execute all test cases and finish
* Run `npm run auto:test` to execute all test cases and re-execute again whenever new changes are added.
