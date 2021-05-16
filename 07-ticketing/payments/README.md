# Payments Microservice

```powershell
# Install initial dependencies
npm i typescript ts-node-dev express @types/express

# Generate TypeScript config file
tsc --init

# Install a dependency for data validation
npm i express-validator

# Install dependency for async error handling
npm i express-async-errors

# Install Mongoose for connecting to and working with MongoDB
npm i mongoose

# Install dependencies for creating cookie-based session middleware
npm i cookie-session @types/cookie-session

# Install dependencies for generating JSON Web Tokens
npm i jsonwebtoken @types/jsonwebtoken

# Install dependencies for testing
npm i -D @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server

# Install common dependency (defined in the common module)
# To update this dependency, run npm update @hoang-ticketing/common
npm i @hoang-ticketing/common

# Install optimistic concurrency control plugin for Mongoose
# (increase document version numbers on each save, and prevent previous
# versions of a document from being saved over the current version)
npm i mongoose-update-if-current

# Install Stripe to handle payment requests
npm i stripe
```
