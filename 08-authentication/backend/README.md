# Backend

## Commands Log

```powershell
# Install dependencies for the app
npm i --save express mongoose morgan typescript ts-node-dev

# Install type dependencies
npm i --save-dev @types/morgan @types/express

# Init TypeScript config file
tsc --init

# Install dependencies to encrypt and decrypt passwords
npm i bcrypt
npm i --save-dev @types/bcrypt

# Install a dependencies to generate and validate JSON Web Tokens
npm i @types/jsonwebtoken
npm i --save-dev @types/jsonwebtoken

# Install dependencies to authenticate requests
npm i passport passport-jwt
npm i --save-dev @types/passport @types/passport-jwt

# Install dependencies to handle login using username and password
npm i passport-local
npm i --save-dev @types/passport-local
```

## Flow of Saving and Comparing Passwords

### Saving a Password (Signup)

:key: `Salt` + :lock: `Plain Password` :arrow_forward::arrow_forward:(`Bcrypt`):arrow_forward::arrow_forward: :closed_lock_with_key: `Salt + Hashed Password`

## Comparing a Password (Signin)

:one: :closed_lock_with_key:`Salt + Hashed Password` :twisted_rightwards_arrows: :key:`Salt`
:two: :key:`Salt` + :lock:`Submitted Password` :arrow_forward::arrow_forward:(`Bcrypt`):arrow_forward::arrow_forward: `Hashed Password`
:three: Compare `Hashed Password` (calculated in :two:) and `Hashed Password` (stored in database in a form of :closed_lock_with_key:`Salt + Hashed Password`)
