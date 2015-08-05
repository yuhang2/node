'use strict';
// 接收参数: -f=url文件
// 检查文件的返回值，统计错误、有结果、无结果的url数量
var commander = require('commander');
var fs = require('fs');
var request = require('request');
var async = require('async');

commander.version('0.0.1')
  .option('-f, --file <value>', 'url file path')
  .option('-t, --type <value>', 'type of urls')
  .parse(process.argv);
try {
  if (!commander.file) {
      throw new Error("need file");
  }
  fs.readFile(commander.file, 'utf8', function(err, data) {
    if (err) throw err;
    var urls = data.split("\n");
    var urlFunc = [];
    for (var i = 0; i < urls.length; i++) {
      if (urls[i].trim() == '') {
        continue;
      }

      (function(url) {
        urlFunc.push(function(cb) {
          request(url, function(error, response, body) {
            if (error || response.statusCode != 200) {
              cb(null, 'error');
              return;
            } else {
              var objBody = JSON.parse(body);
              if (commander.type == 'route') {
                if (objBody.status && objBody.status == 'NOT_FOUND') {
                  console.log(url);
                  cb(null, 'empty');
                } else if (objBody.status && objBody.status == 'ok') {
                  cb(null, 'success');
                } else {
                  console.log(objBody);
                  cb(null, 'accident');
                }
              } else if (commander.type == 'matrix') {
                if (objBody.status && objBody.status == 'NOT_FOUND') {
                  console.log(url);
                  cb(null, 'empty');
                } else if (objBody.Response && objBody.Response.MatrixEntry && objBody.Response.MatrixEntry.length > 0) {
                  cb(null, 'success');
                } else {
                  cb(null, 'accident');
                  console.log(objBody);
                }
              }
            }
          });
        });
      })(urls[i]);
    }
    async.parallelLimit(urlFunc, 100, function(err, results) {
      if (err) {
        throw err;
      }
      var result = {
        success: 0,
        empty: 0,
        fail: 0,
        accident: 0,
        error: 0
      };
      for (var i = 0; i < results.length; i++) {
        result[results[i]]++;
      }
      console.log(result);
    })
  });
} catch (err) {
  console.log(err);
}
