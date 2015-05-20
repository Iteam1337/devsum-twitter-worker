var nconf = require('nconf');
var Twitter = require('twit');
var Q = require('q');

exports.listen = function listen(callback) {
  return Q.Promise(function (resolve, reject) {
    var T = new Twitter(nconf.get('twitter'));
    var tag = nconf.get('hashtag');

    var stream = T.stream('statuses/filter', {
      track: tag
    });

    stream.on('error', function (e) {
      throw new Error(e);
    });

    stream.on('tweet', callback);

    stream.on('connect', resolve.bind(null, tag));
  });
};
