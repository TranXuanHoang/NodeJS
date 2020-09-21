type Operand = number | undefined

enum Operator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/'
}

class Expression {
  operand1: Operand
  operand2: Operand
  operator: Operator
  result: number | Error

  constructor(operand1: Operand, operand2: Operand, operator: Operator) {
    this.operand1 = operand1
    this.operand2 = operand2
    this.operator = operator || Operator.ADD
    this.result = this.eval()
  }

  eval() {
    if (this.operand1 === undefined) {
      return new Error('The first operand is not specified.')
    } else if (this.operand2 === undefined) {
      return new Error('The second operand is not specified.')
    } else if (this.operator === undefined || this.operator === null) {
      return new Error('Operator is not specified.')
    }

    switch (this.operator) {
      case Operator.ADD:
        return this.operand1 + this.operand2
      case Operator.SUBTRACT:
        return this.operand1 - this.operand2
      case Operator.MULTIPLY:
        return this.operand1 * this.operand2
      case Operator.DIVIDE:
        if (this.operand2 === 0) {
          return new Error('Divide by zero.')
        }
        return this.operand1 / this.operand2
      default:
        return new Error('Cannot calculate.')
    }
  }
}

interface History {
  id: string
  expression: Expression
}

class AppState {
  currentExp: Expression
  editingMode: boolean
  editingIndex: number | undefined
  edittingExpressionId: string | undefined
  history: Array<History>
  dirty: boolean

  constructor() {
    this.currentExp = new Expression(undefined, undefined, Operator.ADD)
    this.editingMode = false
    this.history = []
    this.dirty = false
  }
}

class AppUI {
  operand1 = document.getElementById('operand1') as HTMLInputElement
  operand2 = document.getElementById('operand2') as HTMLInputElement
  operator = document.getElementById('operator') as HTMLSpanElement
  calculateBtn = document.getElementById('calculate') as HTMLButtonElement
  result = document.getElementById('result') as HTMLSpanElement
  addOpBtn = document.getElementById('addOp') as HTMLButtonElement
  subOpBtn = document.getElementById('subOp') as HTMLButtonElement
  mulOpBtn = document.getElementById('mulOp') as HTMLButtonElement
  divOpBtn = document.getElementById('divOp') as HTMLButtonElement
  clearBtn = document.getElementById('clear') as HTMLButtonElement
  resetAllBtn = document.getElementById('resetAll') as HTMLButtonElement
  history = document.getElementById('history') as HTMLDivElement
}

class EventBinding {
  appState: AppState
  appUI: AppUI

  constructor(appState: AppState, appUI: AppUI) {
    this.appState = appState
    this.appUI = appUI
    this.fetchHistory().then(() => {
      this.updateHistoryUI()
    })
    this.bindEventHandlers()
  }

  bindEventHandlers() {
    this.appUI.operand1.addEventListener('input', () => {
      this.appState.currentExp.operand1 =
        this.appUI.operand1.value.length > 0 ? +this.appUI.operand1.value : undefined
      this.appState.dirty = true
      console.log(this.appState)
    })

    this.appUI.operand2.addEventListener('input', () => {
      this.appState.currentExp.operand2 =
        this.appUI.operand2.value.length > 0 ? +this.appUI.operand2.value : undefined
      this.appState.dirty = true
      console.log(this.appState)
    })

    this.appUI.calculateBtn.addEventListener('click', async () => {
      this.appState.currentExp.result = this.appState.currentExp.eval()
      if (this.appState.currentExp.result instanceof Error) {
        this.appUI.result.innerHTML = this.appState.currentExp.result.message
      } else {
        let url = 'http://localhost:3000/expression'
        let method = 'POST'
        if (this.appState.editingMode) {
          url += `/${this.appState.edittingExpressionId}`
          method = 'PUT'
        }
        const resData = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.appState.currentExp)
        }).then(res => res.json())

        console.log(resData)
        this.appState.history = resData.histories as Array<History>
        this.appState.dirty = false

        this.appUI.result.innerText = `${this.appState.currentExp.result}`
        this.updateHistoryUI()
      }
    })

    this.appUI.addOpBtn.addEventListener('click', () => {
      this.appState.currentExp.operator = Operator.ADD
      this.appUI.operator.innerText = '+'
      console.log(this.appState)
    })

    this.appUI.subOpBtn.addEventListener('click', () => {
      this.appState.currentExp.operator = Operator.SUBTRACT
      this.appUI.operator.innerText = '-'
      console.log(this.appState)
    })

    this.appUI.mulOpBtn.addEventListener('click', () => {
      this.appState.currentExp.operator = Operator.MULTIPLY
      this.appUI.operator.innerText = '*'
      console.log(this.appState)
    })

    this.appUI.divOpBtn.addEventListener('click', () => {
      this.appState.currentExp.operator = Operator.DIVIDE
      this.appUI.operator.innerText = '/'
      console.log(this.appState)
    })

    this.appUI.clearBtn.addEventListener('click', () => {
      this.appState.currentExp.operand1 = undefined
      this.appState.currentExp.operand2 = undefined
      this.appState.editingMode = false
      this.appState.editingIndex = undefined
      this.appState.edittingExpressionId = undefined
      this.appState.dirty = false

      this.appUI.operand1.value = ''
      this.appUI.operand2.value = ''
      this.appUI.result.innerText = ''
      console.log(this.appState)
    })

    this.appUI.resetAllBtn.addEventListener('click', async () => {
      await fetch('http://localhost:3000/expressions', {
        method: 'DELETE'
      }).then(res => res.json())
      this.appState.currentExp = new Expression(undefined, undefined, Operator.ADD)
      this.appState.editingMode = false
      this.appState.editingIndex = undefined
      this.appState.edittingExpressionId = undefined
      this.appState.history = []
      this.appState.dirty = false

      this.appUI.operand1.value = ''
      this.appUI.operand2.value = ''
      this.appUI.operator.innerText = '+'
      this.appUI.result.innerText = ''
      this.appUI.history.innerHTML = ''
      console.log(this.appState)
    })
  }

  async fetchHistory() {
    const resData = await fetch('http://localhost:3000/histories').then(res => res.json())
    this.appState.history = resData.histories as Array<History>
  }

  updateHistoryUI() {
    this.appUI.history.innerHTML = ''
    this.appState.history.forEach((h, index) => {
      let paragraph = document.createElement('p')
      paragraph.className = (index + 1) % 2 === 1 ? 'history__odd' : 'history__even'

      let expression = document.createElement('span')
      expression.className = 'history__expression'
      expression.innerText = `${h.expression.operand1} ${h.expression.operator} ${h.expression.operand2} = ${h.expression.result}`

      let editAnchor = document.createElement('a')
      editAnchor.className = 'history__edit'
      editAnchor.innerText = 'Edit'
      editAnchor.addEventListener('click', () => {
        this.appState.editingMode = true
        this.appState.editingIndex = index
        this.appState.edittingExpressionId = h.id
        this.appState.currentExp = new Expression(h.expression.operand1, h.expression.operand2, h.expression.operator)

        this.appUI.operand1.value = `${h.expression.operand1}`
        this.appUI.operand2.value = `${h.expression.operand2}`
        this.appUI.operator.innerText = h.expression.operator
        this.appUI.result.innerText = `${h.expression.result instanceof Error ? h.expression.result.message : h.expression.result}`
        console.log(this.appState)
      })

      let deleteAnchor = document.createElement('a')
      deleteAnchor.className = 'history__delete'
      deleteAnchor.innerText = 'Delete'
      deleteAnchor.addEventListener('click', async () => {
        const resData = await fetch(`http://localhost:3000/expression/${h.id}`, {
          method: 'DELETE'
        }).then(res => res.json())

        this.appState.currentExp = new Expression(undefined, undefined, Operator.ADD)
        this.appState.editingMode = false
        this.appState.editingIndex = undefined
        this.appState.edittingExpressionId = undefined
        this.appState.history = resData.histories as Array<History>
        this.appState.dirty = false

        this.appUI.operand1.value = ''
        this.appUI.operand2.value = ''
        this.appUI.operator.innerText = '+'
        this.appUI.result.innerText = ''
        this.appUI.history.innerHTML = ''
        this.updateHistoryUI()
        console.log(this.appState)
      })

      paragraph.appendChild(expression)
      paragraph.appendChild(editAnchor)
      paragraph.appendChild(deleteAnchor)
      this.appUI.history.appendChild(paragraph)
    })
  }
}

class App {
  appState: AppState
  appUI: AppUI
  eventBinding: EventBinding

  constructor() {
    this.appState = new AppState()
    this.appUI = new AppUI()
    this.eventBinding = new EventBinding(this.appState, this.appUI)
  }
}

new App()
