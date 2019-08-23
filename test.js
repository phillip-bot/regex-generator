'use strict';

const {regexFromExamples} = require('./');

const examples = new Map([
  ['!event test 4pm et', '4pm et'],
  ['!event test 4 pm et', '4 pm et'],
  ['!event test 2:00 pm et', '2:00 pm  et'],
  ['!event test 3:52 pm et', '3:52 pm et'],
  ['!event test 2:00pm pt', '2:00pm pt'],
  ['!event test 1:30am pt', '1:30am pt'],
  ['!event test 9:21am pt', '9:21am pt']
]);

const {seed, regex} = regexFromExamples(examples, {});

console.log(seed);
console.log(regex);

examples.forEach(function (substring, string) {
  console.log(string.match(regex));
});
