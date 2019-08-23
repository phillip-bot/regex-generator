'use strict';

const Bar = require('./lib/bar');
const Concat = require('./lib/concat');
const Group = require('./lib/group');
const List = require('./lib/list');
const Literal = require('./lib/literal');
const Plus = require('./lib/plus');
const Question = require('./lib/question');
const Range = require('./lib/range');
const Star = require('./lib/star');

const Operator = require('./lib/operator');
const BinaryOperator = require('./lib/binary-operator');

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
