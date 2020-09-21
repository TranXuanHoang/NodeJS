import { Router } from 'express'

import { Expression } from '../models/expression'
import { History } from '../models/history'

let histories: History[] = []

const router = Router()

// Fetch all histories
router.get('/histories', (req, res, next) => {
  res.status(200).json({
    histories
  })
})

// Add a new expression to the history of expressions
router.post('/expression', (req, res, next) => {
  const { operand1, operand2, operator } = req.body
  const newHistory: History = {
    id: Date.now().toString(),
    expession: new Expression(+operand1, +operand2, operator)
  }

  histories.unshift(newHistory)
  res.status(201).json({
    message: 'New expression was saved.',
    newHistory,
    histories
  })
})

// Update an existing expression saved in the histories array
router.put('/expression/:id', (req, res, next) => {
  const id = req.params.id
  const historyIndex = histories.findIndex(h => h.id === id)
  if (historyIndex >= 0) {
    const { operand1, operand2, operator } = req.body
    histories[historyIndex] = {
      id,
      expession: new Expression(operand1, operand2, operator)
    }
    return res.status(200).json({
      message: 'Updated history.',
      histories
    })
  }
  res.status(404).json({ message: 'Could not find an expression with this id.' })
})

// Delete an expression
router.delete('/expression/:id', (req, res, next) => {
  histories = histories.filter(h => h.id !== req.params.id)
  res.status(200).json({
    message: 'Deleted expression from history.',
    histories
  })
})

// Delete all expressions
router.delete('/expressions', (req, res, next) => {
  histories = []
  res.status(200).json({
    message: 'All expressions were deleted.'
  })
})

export default router
