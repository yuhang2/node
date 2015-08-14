'use strict';
var url = require('url');

function parseLocation(pattern, key, query) {
  var num, location;
  num = key.match(pattern)[1];
  if (typeof query[key] === 'string') {
    location = query[key].split(',');
  } else {
    location = query[key][query[key].length - 1].split(',');
  }
  return {
    location: location,
    num: num
  };
}

function parseMatrixUrl(urlString) {
  var urlObj;
  urlObj = url.parse(urlString, true);
  var key, result, starts = [], destinations = [];
  var startPattern = /^start(\d+)$/i, destinationPattern = /^destination(\d+)$/i;
  for (key in urlObj.query) {
    if (!urlObj.query.hasOwnProperty(key)) {
      continue;
    }
    if (startPattern.test(key)) {
      result = parseLocation(startPattern, key, urlObj.query);
      if (result.location.length !== 2) {
        throw new Error(urlObj.query);
      }
      starts[result.num] = [+result.location[0], +result.location[1]];
    } else if (destinationPattern.test(key)) {
      result = parseLocation(destinationPattern, key, urlObj.query);
      if (result.location.length !== 2) {
        throw new Error(urlObj.query);
      }
      destinations[result.num] = [+result.location[0], +result.location[1]];
    }
  }
  return {
    starts: starts,
    destinations: destinations
  };
}

function callGoogle() {

}

function callGrab(parameter, type) {

}

module.exports = {
  parseMatrixUrl: parseMatrixUrl,
  callGrab: callGrab,
  callGoogle: callGoogle
};