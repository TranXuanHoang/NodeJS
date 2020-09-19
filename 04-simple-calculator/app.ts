enum Operator {
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE
}

class Expression {
  operand1: number
  operand2: number
  operator: Operator
  result: number | Error

  constructor(operand1: number, operand2: number, operator: Operator) {
    this.operand1 = operand1
    this.operand2 = operand2
    this.operator = operator || Operator.ADD
    this.result = this.eval()
  }

  eval() {
    if (!this.operand1) {
      return new Error('The first operand is not specified.')
    } else if (!this.operand2) {
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

class AppState {
  currentExp: Expression
  history: Array<Expression>
  dirty: boolean

  constructor() {
    this.currentExp = new Expression(0, 0, Operator.ADD)
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
    this.registerEvents()
  }

  registerEvents() {
    this.appUI.operand1.addEventListener('input', () => {
      //TODO
    })

    this.appUI.operand2.addEventListener('input', () => {
      //TODO
    })

    this.appUI.calculateBtn.addEventListener('click', () => {
      //TODO
    })

    this.appUI.addOpBtn.addEventListener('click', () => {
      //TODO
    })

    this.appUI.subOpBtn.addEventListener('click', () => {
      //TODO
    })

    this.appUI.mulOpBtn.addEventListener('click', () => {
      //TODO
    })

    this.appUI.divOpBtn.addEventListener('click', () => {
      //TODO
    })

    this.appUI.clearBtn.addEventListener('click', () => {
      //TODO
    })

    this.appUI.resetAllBtn.addEventListener('click', () => {
      //TODO
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

const app = new App()
