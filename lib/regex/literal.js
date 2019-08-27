'use strict';

const Node = require('./node');

class Literal extends Node {
  constructor(value) {
    super();

    if (value.length > 2) {
      throw new Error(
        'Invalid literal. Literals must be at most 2 characters in length.'
      );
    }

    this.value = value;
  }

  toString() {
    return this.value;
  }

  size() {
    return this.value.length;
  }

  weightedSize() {
    if (this.value === '\\d') {
      return 1;
    }

    if (this.value === '\\w') {
      return 10;
    }

    if (this.value === '.') {
      return 20;
    }

    return 1;
  }

  copy() {
    return new Literal(this.value);
  }

  toArray() {
    return [this];
  }
}

module.exports = Literal;
