'use strict';

const fs = require('fs');

const {regexFromExamples} = require('./');

function readExamplesFromFile(path) {
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');
  const examples = new Map(
    lines
      .map(function (line) {
        return line.split(',');
      })
      .slice(0, lines.length - 1)
  );

  return examples;
}

const examples = readExamplesFromFile('./examples/timezones.txt');
console.log(examples);

const {seed, regex} = regexFromExamples(examples, {
  iterationsThreshold: 10
});

console.log(seed);
console.log(regex);

examples.forEach(function (substring, string) {
  console.log(string.match(regex));
});
