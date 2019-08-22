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
}

module.exports = Concat;
