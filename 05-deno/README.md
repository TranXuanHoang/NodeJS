# Basics of Deno

[![Written In](https://img.shields.io/badge/Written%20in-Deno-000000?style=flat&logo=Deno)](https://deno.land/)
[![Using](https://img.shields.io/badge/Using-TypeScript-007ACC?style=flat&logo=TypeScript)](https://www.typescriptlang.org/)

This project aims to work with basic features of [Deno](https://deno.land/) which is _a **secure** runtime for **JavaScript** and **TypeScript**_.

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Implementation |
|---------|----------------|
| [v12.0.0](https://github.com/TranXuanHoang/NodeJS/releases/tag/v12.0.0) | Working with `Deno` |

## Run Apps

The project contains the following `TypeScript` `.ts` files which are entry points of apps that demonstrate some of the basic concepts of `Deno`.

| App | Description |
|-----|-------------|
| [language.ts](./language.ts) | An example of how to _(i) write data to a file on the local hard disk_ and _(ii) handle HTTP requests_ with `Deno` core runtime API and standard library <pre lang="shell" style="color: #2471A3">deno run --allow-write --allow-net language.ts</pre> |
| [tasks.ts](./tasks.ts) | Demonstrates how to write REST APIs with `Deno` and [`Oak`](https://deno.land/x/oak) <pre lang="shell" style="color: #2471A3">deno run --allow-net --allow-write --allow-read --allow-plugin --unstable tasks.ts</pre> The app will run on `localhost:8000`. To start its front-end app, change directory to [tasks-frontend](./tasks-frontend) and run `npm start` - the front-end app will run on `localhost:3000`. |

> Note:
>
> * To force Deno to re-fetch remote dependencies (i.e. to clear the locally cached files), run the `deno run` command with `--reload` flag
>
>     ```shell
>     deno run --reload app_entry_file.ts
>     ```
>
> * To lock a certain version for a remote file, specify its version (normally a GIT tag of a release of the library containing that file) in the import URL
>
>     ```javascript
>     import { serve } from 'https://deno.land/std@0.70.0/http/server.ts'
>     ```
>
> * To automatically reload app whenever new changes are made, use [denon](https://deno.land/x/denon) which is similar to [nodemon](https://nodemon.io/) in [Node.js]
>
>     ```shell
>     # Generate `scripts.json` to specify denon configuration
>     $ denon --init
>     ```
>
>    Then specify configurations for `denon` in the [`scripts.json`](./scripts.json) file.
>    Run the [language.ts](./language.ts) app with `denon start:language` and [tasks.ts](./tasks.ts) with `denon start:tasks`.
