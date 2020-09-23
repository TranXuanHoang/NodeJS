import { Router } from 'https://deno.land/x/oak/mod.ts'
import { ObjectId } from 'https://deno.land/x/mongo@v0.12.1/mod.ts'

import { getDb } from '../helpers/db_client.ts'

const router = new Router()

interface Todo {
  id?: string
  text: string
}

interface TodoSchema {
  _id: ObjectId
  text: string
}

router.get('/todos', async (ctx, next) => {
  // Retrieve todos from database
  const todos = await getDb().collection<TodoSchema>('todos').find()

  // Convert data retrieved from database to a form
  const transformedTodos = todos.map(todo => {
    return { id: todo._id.$oid, text: todo.text }
  })

  ctx.response.body = { todos: transformedTodos } // Oak will automacally handle this as JSON
})

router.post('/todos', async (ctx, next) => {
  const data = await ctx.request.body().value as { text: string }
  const newTodo: Todo = {
    text: data.text
  }

  const id = await getDb().collection<TodoSchema>('todos').insertOne(newTodo)
  newTodo.id = id.$oid

  ctx.response.body = {
    message: 'Created todo!',
    todo: newTodo
  }
})

router.put('/todos/:todoId', async (ctx, next) => {
  const id = ctx.params.todoId! // use ! to make sure that todoId will not be undefined
  const data = await ctx.request.body().value as { text: string }

  const updatedResult = await getDb().collection<TodoSchema>('todos')
    .updateOne(
      { _id: ObjectId(id) }, // filter condition - determine which todo to update
      { $set: { text: data.text } } // update data - which data field to update
    )

  if (updatedResult && updatedResult.matchedCount) {
    ctx.response.body = { message: 'Updated todo!', updatedResult }
  } else {
    ctx.response.status = 404
    ctx.response.body = { error: 'Not found todo!' }
  }
})

router.delete('/todos/:todoId', async (ctx, next) => {
  const id = ctx.params.todoId!

  const deleteResult = await getDb().collection<TodoSchema>('todos')
    .deleteOne({ _id: ObjectId(id) })

  if (deleteResult) {
    ctx.response.body = { message: 'Deleted todo', deleteResult }
  } else {
    ctx.response.status = 404
    ctx.response.body = { error: 'Not found todo!', deleteResult }
  }
})

export default router
