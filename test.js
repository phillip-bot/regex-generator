'use strict';

const {regexFromExamples} = require('./');

/*
Const examples = new Map([
  ['!event test 4pm et', '4pm et'],
  ['!event test 4 pm et', '4 pm et'],
  ['!event test 2:00 pm et', '2:00 pm  et'],
  ['!event test 3:52 pm et', '3:52 pm et'],
  ['!event test 2:00pm pt', '2:00pm pt'],
  ['!event test 1:30am pt', '1:30am pt'],
  ['!event test 9:21am pt', '9:21am pt']
]);
*/

const examples = new Map([
  ['!event "tft" 4pm et', '"tft"'],
  ['!event "my-test" 4 pm et', '"my-test"'],
  ['!event "games" 2:00 pm et', '"games"'],
  ['!event "lunch" 3:52 pm et', '"lunch"'],
  ['!event "test" 2:00pm pt', '"test"'],
  ['!event "something-really-long" 1:30am pt', '"something-really-long"'],
  ['!event "tft3" 9:21am pt', '"tft3"'],
  ['!event "apples-to-apples" 9:21am pt', '"apples-to-apples"']
]);

const {seed, regex} = regexFromExamples(examples, {});

console.log(seed);
console.log(regex);

examples.forEach(function (substring, string) {
  console.log(string.match(regex));
});
