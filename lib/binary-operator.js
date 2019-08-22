'use strict';

const Operator = require('./operator');

class BinaryOperator extends Operator {
  constructor(left, right) {
    super();
    this.operator = null;
    this.left = left;
    this.right = right;
    this.children = [left, right];
  }

  toString() {
    return `${this.left.toString()}${this.operator}${this.right.toString()}`;
  }

  size() {
    return this.left.size() + this.right.size() + 1;
  }
}

module.exports = BinaryOperator;
