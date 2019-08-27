'use strict';

const Operator = require('./operator');

class Question extends Operator {
  constructor(node) {
    super();
    this.node = node;
    this.children = [node];
  }

  toString() {
    return `${this.node.toString()}?`;
  }

  size() {
    return this.node.size() + 1;
  }

  weightedSize() {
    return this.node.weightedSize() + 1;
  }

  copy() {
    return new Question(this.node.copy());
  }

  toArray() {
    return [...this.node.toArray(), this];
  }
}

module.exports = Question;
