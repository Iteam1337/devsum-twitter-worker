var nconf = require('nconf');
var Twitter = require('twit');

exports.listen = function listen() {
  nconf.env().file('config.json');
  var T = new Twitter(nconf.get('twitter'));

  var stream = T.stream('statuses/filter', {
    track: 'devsum15'
  });

  stream.on('error', function (e) {
    console.log(e);
  });

  stream.on('tweet', function (tweet) {
    console.log('tweet', tweet);
  });

  console.log('worker running');
};
