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

  copy() {
    return new Literal(this.value);
  }
}

module.exports = Literal;
