'use strict';

const BinaryOperator = require('./binary-operator');

class Range extends BinaryOperator {
  toString() {
    return `[${this.left.toString()}-${this.right.toString()}]`;
  }

  size() {
    return this.node.size() + 3;
  }
}

module.exports = Range;
