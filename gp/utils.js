'use strict';

const random = require('../lib/random');
const {
  Bar,
  Concat,
  Group,
  Interval,
  List,
  Literal,
  Plus,
  Question,
  Range,
  Star,

  Operator,
  BinaryOperator
} = require('../lib/regex');

const literals = generateLiterals();
const operations = [Bar, Concat, Interval, List, Plus, Question, Star];

const utils = {};

utils.join = function (root, branch) {
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
};

utils.cut = function (root) {
  const operators = getOperators(root);
  const operator = utils.getRandomValueFromArray(operators);
  return operator.copy();
};

function getOperators(root) {
  return root.toArray().filter(filterOperators);

  function filterOperators(node) {
    return node instanceof Operator;
  }
}

utils.getRandomValueFromArray = function (array) {
  const randomIndex = Math.floor(array.length * random.number());
  return array[randomIndex];
};

utils.generateRegex = function () {
  const Operation = utils.getRandomValueFromArray(operations);
  let operation;

  if (Operation === Interval) {
    const literal = utils.getRandomValueFromArray(literals);
    const choice = random.number();
    if (choice < 0.5) {
      operation = new Interval(literal, {
        count: Math.ceil(random.number() * 10)
      });
    } else {
      operation = new Interval(literal, {
        min: Math.ceil(random.number() * 10),
        max: Math.ceil(random.number() * 10)
      });
    }
  } else if (Operation === Range) {
    const a = utils.getAlphaNumericLiteral();
    const b = utils.getAlphaNumericLiteral();

    if (a.value < b.value) {
      operation = new Range(new Literal('a'), new Literal('z'));
    } else {
      operation = new Range(new Literal('A'), new Literal('Z'));
    }
  } else if (Operation.prototype instanceof BinaryOperator) {
    const left = utils.getRandomValueFromArray(literals);
    const right = utils.getRandomValueFromArray(literals);

    operation = new Operation(left, right);
  } else {
    const literal = utils.getRandomValueFromArray(literals);
    operation = new Operation(literal);
  }

  return operation;
};

utils.generateLiteral = function () {
  return utils.getRandomValueFromArray(literals);
};

utils.getAlphaNumericLiteral = function () {
  return utils.getRandomValueFromArray(literals.slice(0, 63));
};

function generateLiterals() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-: "!.';
  const literals = Array.from(characters).map(function (character) {
    return new Literal(character);
  });

  // prettier-ignore
  literals.push(new Literal('\?')); // eslint-disable-line
  literals.push(new Literal('\\w'));
  literals.push(new Literal('\\d'));

  return literals;
}

module.exports = utils;
