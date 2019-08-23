'use strict';

const {BinaryOperator, Operator, treeToRegex} = require('./');
const utils = require('./lib/utils');
const random = require('./lib/random');
const {setSeed} = require('./lib/random');
const {seedPopulation} = require('./genetic-programming/seed-population');
const {crossover} = require('./genetic-programming/crossover');
const {fitness} = require('./genetic-programming/fitness');

const REPLICATION = 2.0;
const MUTATION = 0.3;
const CROSSOVER = 0.5;

const POPULATION_SIZE = 1000;
const DELTA_THRESHOLD = 0.0001;
const ITERATION_THRESHOLD = 4;

const examples = new Map([
  ['!event test 4pm et', '4pm et'],
  ['!event test 4 pm et', '4 pm et'],
  ['!event test 2:00 pm et', '2:00 pm  et'],
  ['!event test 3:52 pm et', '3:52 pm et'],
  ['!event test 2:00pm pt', '2:00pm pt'],
  ['!event test 1:30am pt', '1:30am pt'],
  ['!event test 9:21am pt', '9:21am pt']
]);

(function () {
  try {
    setSeed('pizza');
    let population = seedPopulation(POPULATION_SIZE);
    let averageScore = Infinity;
    let delta = Infinity;
    let iterations = 1;
    const best = [];

    for (
      let generation = 0;
      delta > DELTA_THRESHOLD || iterations < ITERATION_THRESHOLD;
      generation++
    ) {
      console.log(`Generation: ${generation}`);
      console.log(`...Population size: ${population.length}`);
      console.log(`...Average score: ${averageScore}`);
      console.log('...Evaluating population');

      const scores = calculateFitness({
        population,
        examples
      });

      console.log(`...Scores size: ${scores.length}`);

      // Selection
      const crossoverSize = Math.min(
        (scores.length * CROSSOVER) / 2,
        (POPULATION_SIZE * CROSSOVER) / 2
      );

      const crossoverCandidates = scores.slice(0, crossoverSize);
      const replicationCandidates = scores.slice(
        0,
        scores.length * REPLICATION
      );

      // Cross Over
      console.log('...Crossing over fit members');
      console.log(
        `...Cross over candidates size: ${crossoverCandidates.length}`
      );

      let crossoverPopulation = [];
      crossoverCandidates.forEach(function (a) {
        const b = utils.getRandomValueFromArray(crossoverCandidates);
        const candidates = crossover(a.node, b.node);
        crossoverPopulation = [...crossoverPopulation, ...candidates];
      });

      console.log(
        `...Cross over population size: ${crossoverPopulation.length}`
      );
      console.log('...Computing new average');

      // Mutation
      const mutationSize = Math.min(
        scores.length * MUTATION,
        POPULATION_SIZE * MUTATION
      );
      const mutationCandidates = scores
        .slice(0, mutationSize)
        .map(({node}) => node);
      const mutatePopulation = mutate({
        population: mutationCandidates
      });

      console.log(`...Mutation population size: ${mutatePopulation.length}`);

      // Termination condition
      best.push(scores[0].score);
      const prevDelta = delta;
      if (best.length >= 2) {
        delta = best[best.length - 2] - best[best.length - 1];
      }

      if (prevDelta === delta) {
        iterations++;
      } else {
        iterations = 1;
      }

      // Next generation
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
        console.log(match[0]);
      });
    });

    console.log(best);
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
      examples.forEach(function (expectedStr, string) {
        const match = string.match(re);
        const actualStr = match ? match[0] : '';

        score += fitness({node, actualStr, expectedStr});
      });

      scores.push({node, score: score});
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
