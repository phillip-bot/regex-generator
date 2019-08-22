'use strict';

const Operator = require('./operator');

class Plus extends Operator {
  constructor(node) {
    super();
    this.node = node;
  }

  toString() {
    return `${this.node.toString()}+`;
  }

  size() {
    return this.node.size() + 1;
  }
}

module.exports = Plus;
