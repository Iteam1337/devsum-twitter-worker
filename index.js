var nconf = require('nconf');
nconf.env('__').file(process.cwd() + '/config.json');

var express = require('express');
var streamer = require('./lib/streamer');
var parser = require('./lib/parser');
var poster = require('./lib/poster');
var elastic = require('./lib/elastic');
var app = express();

function onTweet(tweet) {
  parser
    .parseTweet(tweet)
    .then(poster.send)
    .then(elastic.save.bind(null, tweet))
    .then(function (result) {
      console.log('result', result);
    })
    .catch(function (error) {
      console.log('something borked!', error);
    })
    .done();
}

app.listen(process.env.PORT ||  3000, function () {
  streamer
  .listen(onTweet)
  .then(function () {
    console.log('started listening to tweets');
  });
});
