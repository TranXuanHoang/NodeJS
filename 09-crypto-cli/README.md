# Cryptography CLI

This project demonstrates how to build a `Command Line Interface (CLI)` with `Node.js`. The `CLI` allows us to:

- Config an `API Key` to fetch information of some of `Bitcoins` from [Nomics](https://nomics.com/).
- Generate `asymmetric key pairs` that can be used in signing and verifying data.
- Do `asymmetric encryption` and `decryption`.
- Do `symmetric encryption` and `decryption`.
- Hash data (like hashing passwords into a form that others cannot guess its original value)
- Generate and verify `JSON Web Token`
- ...

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v16.0.1](https://github.com/TranXuanHoang/NodeJS/releases/tag/v16.0.1) | [diff](https://github.com/TranXuanHoang/NodeJS/compare/v16.0.0...v16.0.1) | Build a cryptography `CLI` |

## How to install and use the CLI

### Build app

```powershell
# Build one time and done
npm run build

# Build in watch mode (any changes in the source code will trigger a build again)
npm run build:watch
```

### Install CLI

```powershell
# Windows
npm run install:cli:windows

# macOS/Linux
npm run install:cli:mac
```

### Run CLI

```powershell
cryptocli
```
