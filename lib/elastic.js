'use strict';
var nconf = require('nconf');
var Q = require('q');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: nconf.get('elasticsearch').host
});

exports.saveFace = function saveFace(faceObject) {
  var hashtag = nconf.get('hashtag');
  var params = {
    index: hashtag,
    type: 'face',
    id: faceObject.face.faceId,
    body: faceObject
  };
  console.log('\nsaving face', JSON.stringify(params));
  return client.index(params);
};

exports.saveTweet = function saveTweet(json) {
  console.log('\n saving tweet', JSON.stringify(json));
  json.timestamp = Date.now();
  var params = {
    index: 'tweets',
    type: 'tweet',
    id: json.id,
    body: json
  };
  return Q.promise(function (resolve, reject) {
    client.index(params, function () {
      resolve(json);
    });
  });
};
