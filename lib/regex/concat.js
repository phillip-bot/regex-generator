'use strict';

const BinaryOperator = require('./binary-operator');

class Concat extends BinaryOperator {
  constructor(left, right) {
    super(left, right);
    this.operator = '';
  }

  size() {
    return this.left.size() + this.right.size();
  }

  copy() {
    return new Concat(this.left.copy(), this.right.copy());
  }
}

module.exports = Concat;
