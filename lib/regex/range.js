'use strict';

const BinaryOperator = require('./binary-operator');
const Literal = require('./literal');

class Range extends BinaryOperator {
  constructor(left, right) {
    if (!(left instanceof Literal && right instanceof Literal)) {
      throw new Error('Range must only container literals');
    }

    if (right.value < left.value) {
      super(right, left);
    } else {
      super(left, right);
    }
  }

  toString() {
    return `[${this.left.toString()}-${this.right.toString()}]`;
  }

  size() {
    return this.left.size() + this.right.size() + 3;
  }

  weightedSize() {
    return this.left.weightedSize() + this.right.weightedSize() + 3;
  }

  copy() {
    return new Range(this.left.copy(), this.right.copy());
  }
}

module.exports = Range;
