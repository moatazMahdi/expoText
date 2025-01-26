/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ConditionExpressionConstructor {
  values: any;
  expression: (values: any) => boolean;
}

export class ConditionExpression {
  private _expression: (values: any) => boolean;

  private _values: any;

  evaluate: () => boolean;

  constructor(input: ConditionExpressionConstructor) {
    this.setExpression(input.expression);
    this.setValues(input.values);
    this.evaluate = () => this.expression(this.values);
  }

  private setValues(values: any) {
    this._values = values;
  }

  get values() {
    return this._values;
  }

  get expression() {
    return this._expression;
  }

  private setExpression(expression: (value: any) => boolean) {
    this._expression = expression;
  }

  and(expression: ConditionExpression) {
    const value = this.evaluate();
    this.evaluate = () => (value && expression.evaluate());
    return this;
  }

  or(expression: ConditionExpression) {
    const value = this.evaluate();
    this.evaluate = () => (value || expression.evaluate());
    return this;
  }
}

// eslint-disable-next-line no-shadow
export enum ConditionalStatementTypes {
  IF,
  ELSEIF,
  ELSE,
}

export interface ConditionStatementConstructor<T extends ConditionalStatementTypes> {
  type: T;
  expression: ConditionExpression;
  action: () => void;
}

export class ConditionStatement<T extends ConditionalStatementTypes> {
  private _type: T;

  private _expression: ConditionExpression;

  private _action: () => void;

  constructor(input: ConditionStatementConstructor<T>) {
    this.setType(input.type);
    this.setExpression(input.expression);
    this.setAction(input.action);
  }

  get type() {
    return this._type;
  }

  private setType(type: T) {
    this._type = type;
  }

  get expression() {
    return this._expression;
  }

  private setExpression(expression: ConditionExpression) {
    this._expression = expression;
  }

  get action() {
    return this._action;
  }

  private setAction(action: () => void) {
    this._action = action;
  }
}

export interface ConditionConstructor {
  values: any;
  initialStatement: ConditionStatement<ConditionalStatementTypes.IF>;
}

export class Condition {
  private _values: any;

  evaluate: () => [boolean, () => void];

  constructor(input: ConditionConstructor) {
    this.setValues(input.values);
    this.evaluate = () => {
      if (input.initialStatement.expression.evaluate()) {
        return [true, input.initialStatement.action];
      }
      return [false, input.initialStatement.action];
    };
  }

  get values() {
    return this._values;
  }

  setValues(values: any) {
    this._values = values;
  }

  addIf(statement: ConditionStatement<ConditionalStatementTypes.ELSEIF>) {
    const [value, action] = this.evaluate();
    this.evaluate = () => {
      if (!value) {
        if (statement.expression.evaluate()) {
          return [true, statement.action];
        }
        return [false, statement.action];
      }
      return [value, action];
    };
    return this;
  }

  addElse(statement: ConditionStatement<ConditionalStatementTypes.ELSE>) {
    const [value, action] = this.evaluate();
    this.evaluate = () => {
      if (!value) {
        return [true, statement.action];
      }
      return [value, action];
    };
    return this;
  }

  execute() {
    const [value, action] = this.evaluate();
    if (value) {
      action();
    }
  }
}
