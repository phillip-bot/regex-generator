'use strict';

const Bar = require('./bar');
const Concat = require('./concat');
const Group = require('./group');
const List = require('./list');
const Literal = require('./literal');
const Plus = require('./plus');
const Question = require('./question');
const Range = require('./range');
const Star = require('./star');

const Operator = require('./operator');
const BinaryOperator = require('./binary-operator');

const treeToRegex = function (node) {
  return new RegExp(node.toString());
};

module.exports = {
  // Classes
  Bar,
  Concat,
  Group,
  List,
  Literal,
  Plus,
  Question,
  Range,
  Star,

  // Abstract Classes
  BinaryOperator,
  Operator,

  treeToRegex
};
