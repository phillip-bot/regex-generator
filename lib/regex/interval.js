'use strict';

const Operator = require('./operator');

class Interval extends Operator {
  constructor(node, {count, min, max}) {
    if (!count && !min && !max) {
      throw new Error('Oops, {count}, {min}, or {min, max} must be specified.');
    }

    super();
    this.node = node;
    this.children = [node];

    this.count = count;
    this.min = min;
    this.max = max;
  }

  toString() {
    if (this.min && !this.max) {
      return `${this.node.toString()}{${this.min},}`;
    }

    if (this.min && this.max) {
      return `${this.node.toString()}{${this.min}, ${this.max}}`;
    }

    return `${this.node.toString()}{${this.count}}`;
  }

  size() {
    return this.node.size() + 3;
  }

  copy() {
    return new Interval(this.node.copy(), {
      min: this.min,
      max: this.max,
      count: this.count
    });
  }

  toArray() {
    return [...this.node.toArray(), this];
  }
}

module.exports = Interval;
