'use strict';

const Operator = require('./operator');

class List extends Operator {
  constructor(node) {
    super();
    this.node = node;
  }

  toString() {
    return `[${this.node.toString()}]`;
  }

  size() {
    return this.node.size() + 2;
  }
}

module.exports = List;
