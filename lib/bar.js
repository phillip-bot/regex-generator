'use strict';

const BinaryOperator = require('./binary-operator');

class Bar extends BinaryOperator {
  constructor(left, right) {
    super(left, right);
    this.operator = '|';
  }

  copy() {
    return new Bar(this.left.copy(), this.right.copy());
  }
}

module.exports = Bar;
