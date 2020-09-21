export type Operand = number | undefined

export enum Operator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/'
}

export class Expression {
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
