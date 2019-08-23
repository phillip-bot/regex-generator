'use strict';

const {BinaryOperator, Operator, treeToRegex} = require('./');
const utils = require('./lib/utils');
const random = require('./lib/random');
const {setSeed} = require('./lib/random');
const {seedPopulation} = require('./genetic-programming/seed-population');
const {crossover} = require('./genetic-programming/crossover');
const {fitness} = require('./genetic-programming/fitness');

const REPLICATION = 0.3;
const MUTATION = 0.2;
const CROSSOVER = 0.2;

const POPULATION_SIZE = 10000;

const examples = new Map([
  ['!event test 4pm et', '4pm et'],
  ['!event test 4 pm et', '4 pm et'],
  ['!event test 2:00 pm et', '2:00 pm et'],
  ['!event test 2:00pm et', '2:00pm et'],
  ['!event test 12:00pm mt', '12:00pm mt'],
  ['!event test 1:30am pt', '1:30am pt']
]);

(function () {
  try {
    setSeed('pizza');
    let population = seedPopulation(POPULATION_SIZE);
    let averageScore = 4;

    for (let generation = 0; averageScore > 0; generation++) {
      console.log(`Generation: ${generation}`);
      console.log(`Average Score: ${averageScore}`);
      console.log('...Evaluating population');

      const scores = calculateFitness({
        population,
        examples
      });

      console.log(`...Population length ${population.length}`);
      console.log(`...Scores length ${scores.length}`);

      // Selection
      const crossoverSize = Math.max(
        scores.length * CROSSOVER,
        population.length * CROSSOVER
      );
      const crossoverCandidates = scores.slice(0, crossoverSize);
      const replicationCandidates = scores.slice(
        0,
        scores.length * REPLICATION
      );

      // Cross Over
      console.log('...Crossing over fit members');
      console.log(`...Cross over candidates: ${crossoverCandidates.length}`);

      let crossoverPopulation = [];
      crossoverCandidates.forEach(function (a) {
        const b = utils.getRandomValueFromArray(crossoverCandidates);
        const candidates = crossover(a.node, b.node);
        crossoverPopulation = [...crossoverPopulation, ...candidates];
      });

      console.log('...Computing new average');

      // Mutation
      const mutationCandidates = scores
        .slice(0, scores.length * MUTATION)
        .map(({node}) => node);
      const mutatePopulation = mutate({
        population: mutationCandidates
      });

      // Termination condition
      let sum = 0;
      scores.slice(0, scores.length * 0.05).forEach(function ({score}) {
        sum += score;
      });
      averageScore = sum / (scores.length * 0.05);

      population = [
        ...crossoverPopulation,
        ...replicationCandidates.map(({node}) => node),
        ...mutatePopulation
      ];
    }

    const p = calculateFitness({population, examples});
    p.slice(0, 10).forEach(function ({node}) {
      console.log(treeToRegex(node));
      const re = treeToRegex(node);
      examples.forEach(function (expectedStr, string) {
        const match = string.match(re);
        console.log(match);
      });
    });
  } catch (err) {
    console.error(err);
  }
})();

function calculateFitness({population, examples}) {
  let scores = [];
  population.forEach(function (node) {
    try {
      const re = treeToRegex(node);

      let score = 0;
      let matches = 0;
      examples.forEach(function (expectedStr, string) {
        const match = string.match(re);

        if (!match) {
          return;
        }

        const actualStr = match[0];

        score += fitness({node, actualStr, expectedStr});
        matches++;
      });

      if (matches === examples.size) {
        scores.push({node, score: score / 3});
      }
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        console.error(err);
      }
    }
  });

  scores = scores.sort(function (a, b) {
    return a.score - b.score;
  });

  return scores;
}

function mutate({population}) {
  return population.map(function (node) {
    const newNode = node.copy();
    const mutation = seedPopulation(1)[0];
    const operators = newNode
      .toArray()
      .filter(node => node instanceof Operator);
    const parent = utils.getRandomValueFromArray(operators).copy();

    if (parent instanceof BinaryOperator) {
      if (random.number() > 0) {
        parent.left = mutation;
      } else {
        parent.right = mutation;
      }

      return newNode;
    }

    parent.node = mutation;
    return newNode;
  });
}
