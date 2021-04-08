# Common

This module is a common library used in shared between microservices of a [ticketing](../) web application.

## Commands Log

```powershell
# Initialize NPM project
npm init -y

# Generate TypeScript config file
tsc --init

# Install TypeScript and del-cli
npm i -D typescript del-cli

# Install initial dependencies
npm i express @types/express

# Install a dependency for data validation
npm i express-validator

# Install dependencies for creating cookie-based session middleware
npm i cookie-session @types/cookie-session

# Install dependencies for generating JSON Web Tokens
npm i jsonwebtoken @types/jsonwebtoken
```

## Publish to NPM Registry

To publish this `common` library to [`NPM`](https://www.npmjs.com/) (as a public package), run the following command

```powershell
# Login to NPM
npm login

# Build project
common:~$ npm run build

# Commit source code to Github
common:~$ git commit -am "Commit message here..."

# Publish package
common:~$ npm publish --access public

# Change version for next publish (only change the patch)
common:~$ npm version patch

common:~$ npm i node-nats-streaming
```
