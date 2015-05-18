var nconf = require('nconf');
var Twitter = require('twit');
var poster = require('./poster');

nconf.env().file(process.cwd() + '/config.json');

exports.listen = function listen() {
  var T = new Twitter(nconf.get('twitter'));

  var stream = T.stream('statuses/filter', {
    track: 'devsum15'
  });

  stream.on('error', function (e) {
    console.log(e);
  });

  stream.on('tweet', poster.send);

  console.log('worker running');
};
