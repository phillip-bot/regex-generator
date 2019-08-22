'use strict';

const seedrandom = require('seedrandom');
const uuid = require('uuid');

const BinaryOperator = require('./lib/binary-operator');
const {
  Bar,
  Concat,
  Group,
  List,
  Literal,
  Plus,
  Question,
  Range,
  Star
} = require('./index');

let random;
/**
 * @param {Number} size - population size
 * @param {String} seed - a seed for random number generation
 * @returns {Array<Node>} an array of Regex trees
 */
const seedPopulation = function (size, seed = `seed-${uuid()}`) {
  console.log(seed);
  random = seedrandom(seed);
  const literals = generateLiterals();
  const operations = [Bar, Concat, Group, List, Plus, Question, Range, Star];

  const population = [];

  for (let i = 0; i < size; i++) {
    const Operation = generateRandomFromArray(operations);
    let operation;

    if (Operation.prototype instanceof BinaryOperator) {
      const left = generateRandomFromArray(literals);
      const right = generateRandomFromArray(literals);

      operation = new Operation(left, right);
    } else {
      const literal = generateRandomFromArray(literals);
      operation = new Operation(literal);
    }

    population.push(operation);
  }

  return population;
};

function generateRandomFromArray(array) {
  const randomIndex = Math.floor(array.length * random());
  return array[randomIndex];
}

function generateLiterals() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const literals = Array.from(characters).map(function (character) {
    return new Literal(character);
  });

  literals.push(new Literal('\\w'));
  literals.push(new Literal('\\d'));
  literals.push(new Literal('-'));
  literals.push(new Literal(':'));
  literals.push(new Literal('.'));
  literals.push(new Literal('\\'));
  literals.push(new Literal('/'));

  return literals;
}

module.exports = {seedPopulation};
