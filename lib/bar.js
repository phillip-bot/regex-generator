'use strict';

const BinaryOperator = require('./binary-operator');

class Bar extends BinaryOperator {
  constructor(left, right) {
    super(left, right);
    this.operator = '|';
  }
}

module.exports = Bar;
