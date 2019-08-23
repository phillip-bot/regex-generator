'use strict';

const {Literal, Range, Operator, BinaryOperator} = require('../lib/regex');
const random = require('../lib/random');
const utils = require('../lib/utils');

const crossover = function (a, b) {
  if (a instanceof Literal || b instanceof Literal) {
    return [a, b];
  }

  return [cross(a, b), cross(b, a)];
};

function cross(a, b) {
  const branch = cut(b);
  return join(a, branch);
}

function join(root, branch) {
  const newRoot = root.copy();
  const operators = getOperators(root);
  const parent = utils.getRandomValueFromArray(operators);

  if (parent instanceof Range) {
    return newRoot;
  }

  if (parent instanceof BinaryOperator) {
    if (random.number() > 0) {
      parent.left = branch;
    } else {
      parent.right = branch;
    }

    return newRoot;
  }

  parent.node = branch;

  return newRoot;
}

function cut(root) {
  const operators = getOperators(root);
  const operator = utils.getRandomValueFromArray(operators);
  return operator.copy();
}

function getOperators(root) {
  return root.toArray().filter(filterOperators);

  function filterOperators(node) {
    return node instanceof Operator;
  }
}

/*
Function cross(operators, nodes) {
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
*/

module.exports = {crossover};
