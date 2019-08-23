'use strict';

const {
  Bar,
  Concat,
  Group,
  List,
  Literal,
  Plus,
  Question,
  Range,
  Star,

  BinaryOperator
} = require('../lib/regex');
const utils = require('../lib/utils');

/**
 * @param {Number} size - population size
 * @param {String} seed - a seed for random number generation
 * @returns {Array<Node>} an array of Regex trees
 */
const seedPopulation = function (size) {
  const literals = generateLiterals();
  const operations = [Bar, Concat, Group, List, Plus, Question, Range, Star];

  const population = [];

  for (let i = 0; i < size; i++) {
    const Operation = utils.getRandomValueFromArray(operations);
    let operation;

    if (Operation.prototype instanceof BinaryOperator) {
      const left = utils.getRandomValueFromArray(literals);
      const right = utils.getRandomValueFromArray(literals);

      operation = new Operation(left, right);
    } else {
      const literal = utils.getRandomValueFromArray(literals);
      operation = new Operation(literal);
    }

    population.push(operation);
  }

  return population;
};

function generateLiterals() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-: .';
  const literals = Array.from(characters).map(function (character) {
    return new Literal(character);
  });

  literals.push(new Literal('\\w'));
  literals.push(new Literal('\\d'));

  return literals;
}

module.exports = {seedPopulation};
