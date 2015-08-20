'use strict';
var root = '../';
var fs = require('fs');
var request = require('httpsync').request;

function addNokiaData(commander) {
  var i, line;
  try {
    if (!commander.file) {
      throw new Error('need file');
    }
    fs.readFile(commander.file, 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
      var lines = data.split('\n');
      line = lines[0].replace(/[\r\n]/g, '').split(',');
      line.push('nokia_shortest_eta');
      line.push('nokia_shortest_distance');
      line.push('nokia_fastest_eta');
      line.push('nokia_fastest_distance');
      line.push('grab_eta');
      line.push('grab_distance\n');
      var info, shortestInfo, fastestInfo, sourceLine, grabInfo, errorInfo;
      fs.appendFile(commander.output, line);
      for (i = 1; i < lines.length; i++) {
        line = lines[i].replace(/[\r\n]/g, '').split(',');
        if (line.length !== 9) {
          continue;
        }
        try {
          info = callNokia(line[5], line[6], line[7], line[8]);
          errorInfo = {
            Response: {
              Route: [
                {
                  Summary: {
                    BaseTime: 'NAN',
                    Distance: 'NAN'
                  }
                }
              ]
            }
          };
          if (info.shortest === 'NAN') {
            shortestInfo = errorInfo;
          } else {
            shortestInfo = JSON.parse(info.shortest);
          }
          if (info.fastest === 'NAN') {
            fastestInfo = errorInfo;
          } else {
            fastestInfo = JSON.parse(info.fastest);
          }
          if (info.grab === 'NAN') {
            grabInfo = errorInfo;
          } else {
            grabInfo = JSON.parse(info.grab);
          }
          if (shortestInfo.Response.Route.length === 0) {
            line.push('emp');
            line.push('emp\n');
          } else {
            line.push(shortestInfo.Response.Route[0].Summary.BaseTime);
            line.push(shortestInfo.Response.Route[0].Summary.Distance);
          }
          if (fastestInfo.Response.Route.length === 0) {
            line.push('emp');
            line.push('emp\n');
          } else {
            line.push(fastestInfo.Response.Route[0].Summary.BaseTime);
            line.push(fastestInfo.Response.Route[0].Summary.Distance);
          }
          if (grabInfo.Response.Route.length === 0) {
            line.push('emp');
            line.push('emp\n');
          } else {
            line.push(grabInfo.Response.Route[0].Summary.BaseTime);
            line.push(grabInfo.Response.Route[0].Summary.Distance + '\n');
          }
          fs.appendFile(commander.output, line);
          sourceLine = line[0] + ',' + info.shortest + ',' + info.fastest + '\n';
          fs.appendFile(commander.source, sourceLine);
        } catch (error) {
          console.log(line[0]);
          console.error(error.toString());
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function callNokia(originLat, originLng, destLat, destLng) {
  var appId = 'KWSDgfhNYJ5LT7vB4BAt';
  var appCode = 'kx29dxpRULHEoXW5HQgWvQ';
  var params = '&waypoint0=' + originLat + ',' + originLng +
    '&waypoint1=' + destLat + ',' + destLng;
  params = encodeURI(params);
  var modes = ['shortest', 'fastest'];
  var i, req, rtn, info, url;
  rtn = {};
  for (i = 0; i < modes.length; i++) {
    url = 'http://route.nlp.nokia.com/routing/6.2/calculateroute.json?' +
      'app_code=' + appCode + '&app_id=' + appId +
      '&mode=' + modes[i] + ';car;traffic:enabled;motorway:1,boatFerry:-1' + params;
    req = request({
      url: url,
      method: 'GET'
    });
    info = req.end();
    if (info.statusCode === 200) {
      rtn[modes[i]] = info.data.toString();
    } else {
      rtn[modes[i]] = 'NAN';
    }
  }
  url = 'http://52.74.40.54:8001/routing/6.2/calculateroute.json?app_code=1&app_id=2mode=fastest;car;traffic:enabled;motorway:1,tollroad:-1,boatFerry:-1' +
    params;
  console.log(url);
  req = request({
    url: url,
    method: 'GET'
  });
  info = req.end();
  if (info.statusCode === 200) {
    rtn.grab = info.data.toString();
  } else {
    rtn.grab = 'NAN';
  }
  return rtn;
}

module.exports = {
  addNokiaData: addNokiaData
};