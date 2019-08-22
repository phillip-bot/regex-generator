'use strict';

const Operator = require('./operator');

class Plus extends Operator {
  constructor(node) {
    super();
    this.node = node;
    this.children = [node];
  }

  toString() {
    return `${this.node.toString()}+`;
  }

  size() {
    return this.node.size() + 1;
  }

  copy() {
    return new Plus(this.node.copy());
  }
}

module.exports = Plus;
