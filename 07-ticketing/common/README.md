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
```

## Publish to NPM Registry

To publish this `common` library to [`NPM`](https://www.npmjs.com/) (as a public package), run the following command

```powershell
# Login to NPM
npm login

# Publish package
common:~$ npm publish --access public
```
