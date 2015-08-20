'use strict';
var commander = require('commander');
var analyse = require('./lib/analyse');
var call = require('./lib/call');
var nokia = require('./lib/nokia');
var typeValue = '';

commander.version('0.0.1')
  .arguments('<type>')
  .option('-f, --file <value>', 'url file path')
  .option('-t, --type <value>', 'type of urls')
  .option('-o, --output <value>', 'save urls')
  .option('-s, --source <value>', 'source results')
  .action(function (type) {
    typeValue = type;
  })
  .parse(process.argv);

if (typeValue === '') {
  console.error('no type given!');
  process.exit(1);
}
if (typeValue === 'analyse') {
  analyse(commander);
} else if (typeValue === 'callMatrix') {
  call.callMatrix(commander, 'matrix');
} else if (typeValue === 'data') {
  nokia.addNokiaData(commander);
} else {
  console.error('node index.js [analyse|callMatrix|data]');
}
