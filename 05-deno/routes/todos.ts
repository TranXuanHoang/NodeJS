import { Router } from 'https://deno.land/x/oak/mod.ts'

const router = new Router()

interface Todo {
  id: string
  text: string
}

let todos: Todo[] = []

router.get('/todos', (ctx, next) => {
  ctx.response.body = { todos } // Oak will automacally handle this as JSON
})

router.post('/todos', async (ctx, next) => {
  const data = await ctx.request.body().value as { text: string }
  const newTodo: Todo = {
    id: `${Date.now()}`,
    text: data.text
  }
  todos.push(newTodo)

  ctx.response.body = {
    message: 'Created todo!',
    todo: newTodo
  }
})

router.put('/todos/:todoId', async (ctx, next) => {
  const id = ctx.params.todoId
  const data = await ctx.request.body().value as { text: string }
  const todoIndex = todos.findIndex(todo => todo.id === id)
  if (todoIndex >= 0) {
    todos[todoIndex] = {
      id: todos[todoIndex].id,
      text: data.text
    }

    ctx.response.body = { message: 'Updated todo!', todos }
  } else {
    ctx.response.status = 404
    ctx.response.body = { error: 'Not found todo!' }
  }
})

router.delete('/todos/:todoId', (ctx, next) => {
  let deletedTodo = false
  const id = ctx.params.todoId
  todos = todos.filter(todo => {
    deletedTodo = deletedTodo || (todo.id === id)
    return todo.id !== id
  })
  if (deletedTodo) {
    ctx.response.body = { message: 'Deleted todo' }
  } else {
    ctx.response.status = 404
    ctx.response.body = { error: 'Not found todo!' }
  }
})

export default router
