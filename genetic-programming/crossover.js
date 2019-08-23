'use strict';

const BinaryOperator = require('../lib/binary-operator');
const Literal = require('../lib/literal');
const Operator = require('../lib/operator');
const Range = require('../lib/range');
const utils = require('../lib/utils');

const crossover = function (a, b) {
  if (a instanceof Literal || b instanceof Literal) {
    return [a, b];
  }

  const aNodes = treeToArray(a);
  const bNodes = treeToArray(b);

  const aOperators = aNodes.filter(filterOperators);
  const bOperators = bNodes.filter(filterOperators);

  const axb = cross(aOperators, bNodes);
  const bxa = cross(bOperators, aNodes);

  return [...axb, ...bxa];
};

function cross(operators, nodes) {
  const operator = utils.getRandomValueFromArray(operators);
  const branch = utils.getRandomValueFromArray(nodes);

  if (operator instanceof Range) {
    return [operator.copy()];
  }

  if (operator instanceof BinaryOperator) {
    const opA = operator.copy();
    const opB = operator.copy();
    opA.left = branch.copy();
    opB.right = branch.copy();

    return [opA, opB];
  }

  const op = operator.copy();
  op.node = branch.copy();
  return [op];
}

function filterOperators(node) {
  return node instanceof Operator;
}

function treeToArray(root) {
  const nodes = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    nodes.push(node);

    node.children.forEach(function (child) {
      queue.push(child);
    });
  }

  return nodes;
}

module.exports = {crossover};
