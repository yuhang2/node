'use strict';
var commander = require('commander');
var analyse = require('./lib/analyse');
var call = require('./lib/call');
var typeValue;

commander.version('0.0.1')
  .arguments('<type>')
  .option('-f, --file <value>', 'url file path')
  .option('-t, --type <value>', 'type of urls')
  .option('-o, --output <value>', 'save urls')
  .action(function (type) {
    typeValue = type;
  })
  .parse(process.argv);

if (typeof typeValue === 'undefined') {
  console.error('no type given!');
  process.exit(1);
}
if (typeValue === 'analyse') {
  analyse(commander);
} else if (typeValue === 'callMatrix') {
  call.callMatrix(commander, 'matrix');
} else {
  console.error('node index.js [analyse|callMatrix]');
}
