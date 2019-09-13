# Regex Generator

A library to generate regular expressions from a map of examples.

## Usage

```js
const {regexFromExamples} = require('regex-generator');

const examples = new Map([
  ['match things in "quotes"', '"quotes"'],
  ['how "cool" is this?', '"cool"'],
  ['what about ?"thiiis"?', '"thiiis"']
]);

const {regex} = regexFromExamples(examples);

console.log(regex);

examples.forEach(function(substring, string) {
  const match = string.match(regex);
  console.log(match[0]);
});

/* This prints something like:
  /".+"/
  "quotes"
  "cool"
  "thiiis"
*/
```
