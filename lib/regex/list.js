'use strict';

const Operator = require('./operator');

class List extends Operator {
  constructor(node) {
    super();
    this.node = node;
    this.children = [node];
  }

  toString() {
    return `[${this.node.toString()}]`;
  }

  size() {
    return this.node.size() + 2;
  }

  weightedSize() {
    return this.node.weightedSize() + 2;
  }

  copy() {
    return new List(this.node.copy());
  }

  toArray() {
    return [...this.node.toArray(), this];
  }
}

module.exports = List;
