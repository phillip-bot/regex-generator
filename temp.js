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
  treeToRegex
} = require('./');

const {setSeed} = require('./lib/random');
const {seedPopulation} = require('./genetic-programming/seed-population');
const {crossover} = require('./genetic-programming/crossover');
const {fitness} = require('./genetic-programming/fitness');

(function () {
  try {
    /*
    Const a = new Literal('a');
    const b = new Literal('b');
    const tree = new Bar(a, b);

    console.log(tree.size());

    const re = treeToRegex(tree);
    console.log(re);

    console.log(re.exec('a'));
    console.log(re.exec('b'));
    console.log(re.exec('c'));
    */

    /*
    const distance = utils.editDistance('pizza', 'pasta');
    console.log(distance);
    */
    setSeed('pizza');

    let averageScore = 10000000;
    let population = seedPopulation(10000);
    const string = '!event test 4pm et';
    const expectedStr = '4pm et';

    for (let generation = 0; generation < 5; generation++) {
      console.log('...Evaluating population');
      let fitPopulation = [];
      population.forEach(function (node) {
        try {
          const re = treeToRegex(node);
          const match = string.match(re);

          if (!match) {
            return;
          }

          const actualStr = match[0];

          const score = fitness({node: node, actualStr, expectedStr});

          fitPopulation.push({node, score});
        } catch (err) {}
      });

      console.log('...Crossing over fit members');
      fitPopulation = fitPopulation
        .sort(function (a, b) {
          return a.score - b.score;
        })
        .filter(function ({score}) {
          return score < averageScore;
        });
      console.log(`...Fit Population Size: ${fitPopulation.length}`);
      let crossoverPopulation = [];
      fitPopulation.slice(0, 100).forEach(function (a) {
        fitPopulation.slice(0, 100).forEach(function (b) {
          const candidates = crossover(a.node, b.node);
          crossoverPopulation = [...crossoverPopulation, ...candidates];
        });
      });

      console.log('...Computing new average');

      if (fitPopulation.length !== 0) {
        let sum = 0;
        fitPopulation.forEach(function ({score}) {
          sum += score;
        });
        averageScore = sum / fitPopulation.length;
      }

      population = [
        ...fitPopulation.map(({node}) => node),
        ...crossoverPopulation
      ];

      console.log(`Generation: ${generation}`);
      console.log(`Average Score: ${averageScore}`);
    }

    let p = [];
    population.forEach(function (node) {
      try {
        const re = treeToRegex(node);
        const match = string.match(re);

        if (!match) {
          return;
        }

        const actualStr = match[0];

        const score = fitness({node: node, actualStr, expectedStr});

        p.push({node, score});
      } catch (err) {}
    });
    p = p.sort(function (a, b) {
      return a.score - b.score;
    });
    console.log(p[0]);
    console.log(treeToRegex(p[0].node));
    console.log(string.match(treeToRegex(p[0].node)));
  } catch (err) {
    console.error(err);
  }
})();
