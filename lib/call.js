'use strict';
var root = '../';
var fs = require('fs');
var request = require('request');
var async = require('async');
var callFunc = require(root + 'lib/callFunc');


function matrix(commander) {
  var i, urlString, urlParameter, parameters = [];
  try {
    if (!commander.file) {
      throw new Error('need file');
    }
    fs.readFile(commander.file, 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
      var urls = data.split('\n');
      // 循环请求url
      for (i = 0; i < urls.length; i++) {
        urlString = urls[i].trim();
        if (urlString === '') {
          continue;
        }
        // 解析出参数
        urlParameter = callFunc.parseMatrixUrl(urlString);
        parameters.push(urlParameter);
      }
      console.log(parameters.length);
      process.exit();
      for (i = 0; i < parameters.length; i++) {
        callFunc.callGrab(parameters[i], 'matrix');
        callFunc.callGoogle();
      }
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  callMatrix: matrix
};