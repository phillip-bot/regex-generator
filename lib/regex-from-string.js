'use strict';

const {Concat, Literal} = require('./regex');

const DIGIT = /\d/;
const ALPHANUMERIC = /\w/;

const general = function (char) {
  if (char.match(DIGIT)) {
    return new Literal('\\d');
  }

  if (char.match(ALPHANUMERIC)) {
    return new Literal('\\w');
  }

  return new Literal('.');
};

const intermediateDigitSpecific = function (char) {
  if (char.match(DIGIT)) {
    return new Literal(char);
  }

  if (char.match(ALPHANUMERIC)) {
    return new Literal('\\w');
  }

  return new Literal(char);
};

const intermediateCharSpecific = function (char) {
  if (char.match(DIGIT)) {
    return new Literal('\\d');
  }

  if (char.match(ALPHANUMERIC)) {
    return new Literal(char);
  }

  return new Literal(char);
};

const specific = function (char) {
  return new Literal(char);
};

const buildTree = function (string, buildLiteral) {
  const centerIndex = Math.floor(string.length / 2);
  const char = string[centerIndex];
  const literal = buildLiteral(char);

  if (string.length === 1) {
    return literal;
  }

  const leftSubstring = string.substring(0, centerIndex);
  const rightSubstring = string.substring(centerIndex + 1);

  let left;
  let right;

  if (!leftSubstring && rightSubstring) {
    left = literal;
    right = buildTree(rightSubstring, buildLiteral);
  } else if (leftSubstring && !rightSubstring) {
    left = buildTree(leftSubstring, buildLiteral);
    right = literal;
  } else {
    right = buildTree(rightSubstring, buildLiteral);
    left = new Concat(buildTree(leftSubstring, buildLiteral), literal);
  }

  return new Concat(left, right);
};

const buildLiteralFunctions = [
  general,
  intermediateDigitSpecific,
  intermediateCharSpecific,
  specific
];

const generatePossibleRegexes = function () {
  return buildLiteralFunctions.map(function (buildLiteral) {
    const node = buildTree('12:15 pm et', buildLiteral);
    return node;
  });
};

module.exports = {generatePossibleRegexes};
