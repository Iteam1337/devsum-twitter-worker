'use strict';
var nconf = require('nconf');
var Q = require('q');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: nconf.get('elasticsearch').host
});

exports.saveFaces = function saveFaces(payload, cb) {
  return Q.all(payload.faces.map(function (face) {
    var body = {
      face: face,
      tweet: payload.tweet,
      timestamp: Date.now()
    };
    var params = {
      index: 'face',
      type: 'item',
      id: face.faceId,
      body: body
    };
    console.log('\nsaving face', JSON.stringify(params));
    return client.index(params, function () {
      cb(body);
    });
  }));
};


exports.saveTweet = function saveTweet(json) {
  console.log('\n saving tweet', JSON.stringify(json));
  json.timestamp = Date.now();
  var params = {
    index: 'tweets',
    type: 'item',
    id: json.id,
    body: json
  };
  return Q.promise(function (resolve, reject) {
    client.index(params, function () {
      resolve(json);
    });
  });
};
