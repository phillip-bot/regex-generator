const Bar = require('./lib/bar');
const Concat = require('./lib/concat');
const Group = require('./lib/group');
const List = require('./lib/list');
const Literal = require('./lib/literal');
const Plus = require('./lib/plus');
const Question = require('./lib/question');
const Range = require('./lib/range');
const Star = require('./lib/star');

const treeToRegex = function (node) {
  return new RegExp(node.toString());
};

module.exports = {
  Bar,
  Concat,
  Group,
  List,
  Literal,
  Plus,
  Question,
  Range,
  Star,

  treeToRegex
};
