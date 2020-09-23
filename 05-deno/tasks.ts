import { Application } from 'https://deno.land/x/oak/mod.ts'

import todosRoutes from './routes/todos.ts'

const app = new Application()

// Print out request information
//
// NOTE (Gotcha of Oak)
// Note that if we just call next() without 'await', Oak will immediately
// return a response before other async middlewares finish processing their
// requests. Therefore, wheneve you have any middlewares that do async stuff,
// you should make all your middlewares async and always await next().
// Doing so ensures that we don't just want to start the next middlewares in line,
// but that we also want to wait for them to finish before we send back
// the automatically generated response. Otherwise, the response bodies set
// by other async middlewares will not be taken into account.
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`)
  const body = await ctx.request.body().value
  if (body) console.log(body)
  await next()
})

// Config to allow CORS
app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*')
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  await next()
})

// Should register both routes() and allowedMethods()
// so that Oak properly handles incomming requests
app.use(todosRoutes.routes())
app.use(todosRoutes.allowedMethods())

await app.listen({ port: 8000 })
