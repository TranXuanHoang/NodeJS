# Basics of Deno

[![Written In](https://img.shields.io/badge/Written%20in-Deno-000000?style=flat&logo=Deno)](https://deno.land/)
[![Using](https://img.shields.io/badge/Using-TypeScript-007ACC?style=flat&logo=TypeScript)](https://www.typescriptlang.org/)

This project aims to work with basic features of [Deno](https://deno.land/) which is _a **secure** runtime for **JavaScript** and **TypeScript**_.

## Run Apps

The project contains the following `TypeScript` `.ts` files which are entry points of apps that demonstrate some of the basic concepts of `Deno`.

| App | Description |
|-----|-------------|
| [language.ts](./language.ts) | An example of how to _(i) write data to a file on the local hard disk_ and _(ii) handle HTTP requests_ with `Deno` core runtime API and standard library <pre lang="shell" style="color: #2471A3">deno run --allow-write --allow-net language.ts</pre> |
