# Simple Calculator

[![Written In](https://img.shields.io/badge/Written%20in-Node.js-026e00?style=flat&logo=Node.js)](https://nodejs.org/)
[![Using](https://img.shields.io/badge/Using-TypeScript-007ACC?style=flat&logo=TypeScript)](https://www.typescriptlang.org/)

Write a simple calculator using [TypeScript](https://www.typescriptlang.org/) in combination with [Node.js](https://nodejs.org/).

## 3rd-Party Packages

The app uses the following 3rd-party packages

| Package | Type | Purpose |
|---------|------|---------|
| [express](https://www.npmjs.com/package/express) | `production` | Provide a web framework while using Node.js |
| [body-parser](https://www.npmjs.com/package/body-parser) | `production` | Parse incoming request bodies in a middleware before the request handlers |
| [nodemon](https://www.npmjs.com/package/nodemon) | `dev` | Auto reload app when making any changes to source code |
| [@types/node](https://www.npmjs.com/package/@types/node) | `dev` | Provides type definitions for [Node.js](https://nodejs.org/) so that `Node.js` syntax can be used in `.ts` [TypeScript](https://www.typescriptlang.org/) source code files |
| [@types/express](https://www.npmjs.com/package/@types/express) | `dev` | Provides type definitions for [Express.js](http://expressjs.com/) so that code autocompletion will be enabled in the VS Code editor |
| [@types/body-parser](https://www.npmjs.com/package/@types/body-parser) | `dev` | Provides type definitions for [body-parser](https://www.npmjs.com/package/body-parser) so that code autocompletion will be enabled in the VS Code editor |

## Config TypeScript in Node.js Applications

To config TypeScript as the main language for implementing logic of a Node.js app, follow the following steps

* `npm init`
* `npm i --save-dev @types/node`
* `npm i --save-dev @types/express`
* `tsc --init`
* Revise [`tsconfig.json`](./tsconfig.json)

    ```json
    {
      ...
      "compilerOptions": {
        ...
        "target": "ES2020",         // To compile TypeScript code to more modern JavaScript code
        ...
        "moduleResolution": "node", // To specify Node.js as module resolution strategy
        ...
        "outDir": "./dist",         // Redirect output structure of .js files to this directory
        "rootDir": "./src",         // Specify the root directory of input .ts files
        ...
      }
      ...
    }
    ```

* Install all other dependencies for our Node.js app - a list of dependencies used in this project can be found in the [3rd-Party Packages](#3rd-party-packages) section
* Create `src` directory and put all source code files in this directory
* Create `app.ts` file which will contain the start of a server hosting the app. In that `app.ts` file, config to host _static resources_ like below

    ```javascript
    app.use(express.static(path.join(__dirname, './public')))
    ```

    then create the `public` directory inside the `src`

    ```powershell
    src --+-- ...
          |
          +-- public --+-- css # contains CSS
          |            |
          |            +-- js  # contains TypeScript and JavaScript files for front-end views
          |            |
          |            +-- images # put images inside this directory
          +-- ...
    ```

    `TypeScript` `.ts` files in the `src/public/js` will be automatically compiled to `JavaScript` by the TypeScript compiler

* Use `import` syntax in `.ts` file like below

    ```javascript
    import express from 'express'
    ```

    instead of the traditional `require` syntax

    ```javascript
    const express = require('express')
    ```

    to get code autocompletion work

* Compile the source code and put result files into `dist` directory

    **Windows PowerShell**

    ```powershell
    # Delete the entire `dist` directory
    Remove-Item -Recurse -Force -Confirm:$false ./dist/*

    # Compile `.ts` files into `.js` files in `src` and put them in
    # `dist` with the same directory structure as in `src`
    tsc

    # Copy `.html`, `.css` resource files from `./` and `src/public` to `dist`
    cp ./*.css ./dist
    cp ./*.html ./dist
    cp -R ./src/public ./dist

    # Remove `.ts` file from `dist/public/js/`
    Remove-Item -Recurse -Force -Confirm:$false ./dist/**/**/*.ts
    ```

    **macOS, Linux Terminal**

    ```powershell
    # Delete the entire `dist` directory
    rm -rf ./dist/*

    # Compile `.ts` files into `.js` files in `src` and put them in
    # `dist` with the same directory structure as in `src`
    tsc

    # Copy `.html`, `.css` resource files from `./` and `src/public` to `dist`
    cp ./*.css ./dist
    cp ./*.html ./dist
    cp -R ./src/public ./dist

    # Remove `.ts` file from `dist/public/js/`
    rm -rf ./dist/**/**/*.ts
    ```

* Run app with `node dist/app.js`
