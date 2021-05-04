# Expiration Microservice

```powershell
# Install initial dependencies
npm i typescript ts-node-dev

# Generate TypeScript config file
tsc --init

# Install dependencies for testing
npm i -D @types/jest jest ts-jest

# Install common dependency (defined in the common module)
# To update this dependency, run npm update @hoang-ticketing/common
npm i @hoang-ticketing/common

# Install dependencies for managing ticket expiration using Redis-based queue
npm i bull @types/bull
```
