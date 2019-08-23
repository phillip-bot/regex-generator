'use strict';

const Operator = require('./operator');

class Group extends Operator {
  constructor(node) {
    super();
    this.node = node;
    this.children = [node];
  }

  toString() {
    return `(${this.node.toString()})`;
  }

  size() {
    return this.node.size() + 2;
  }

  copy() {
    return new Group(this.node.copy());
  }

  toArray() {
    return [...this.node.toArray(), this];
  }
}

module.exports = Group;
