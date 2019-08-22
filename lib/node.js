'use strict';

class Node {
  toString() {
    throw new Error('Oops, toString not implemented');
  }

  size() {
    throw new Error('Oops, size not implemented');
  }
}

module.exports = Node;
