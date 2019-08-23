'use strict';

class Node {
  constructor() {
    this.children = [];
  }

  toString() {
    throw new Error('Oops, toString not implemented');
  }

  size() {
    throw new Error('Oops, size not implemented');
  }

  copy() {
    throw new Error('Oops, copy not implemented');
  }

  toArray() {
    throw new Error('Oops, toArray not implemented');
  }
}

module.exports = Node;
