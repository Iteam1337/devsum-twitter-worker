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
      return reject(new Error(e));
    });

    stream.on('tweet', callback);

    stream.on('connect', resolve.bind(null, tag));
  });
};

exports.search = function search(callback) {
  var T = new Twitter(nconf.get('twitter'));
  var tag = nconf.get('hashtag');

  T.get('search/tweets', { q: '#' + tag, count: 10 }, function(err, data) {
    // console.log('found ', data);
    if (err){ return console.log('search error', err);}
    if (!data.statuses || !data.statuses.length) { return console.log('no results');}

    data.statuses.sort(function(a,b){return a.created_at-b.created_at;}).forEach(function(tweet){
      callback(tweet);
    });
  });
};
