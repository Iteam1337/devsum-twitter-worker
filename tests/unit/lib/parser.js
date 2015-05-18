'use strict';

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('/lib/parser', function () {
  var parser;

  beforeEach(function () {
    mocks = require(process.cwd() + '/tests/mocks.json');

    parser = proxyquire(process.cwd() + '/lib/parser', {});
  });

  describe('#parseTweet', function () {
    it('should ignore tweets without images', function () {
      var tweet = {
        foo: 'bar'
      };
      var result = parser.parseTweet(tweet);

      expect(result).to.eql(null);
    });

    it('should return a simpler version of the tweet with relevant data', function () {
      var tweet = mocks.tweet;
      var result = parser.parseTweet(tweet);

      expect(result).to.eql({
        "id": 600384949892550700,
        "id_str": "600384949892550656",
        "text": "#devsum15 https://t.co/yERARWrLHr  unicorns http://t.co/mYKYjj8D0I",
        "user": {
          "id": 859507844,
          "id_str": "859507844",
          "name": "Radu Achim",
          "screen_name": "a8a3d2"
        },
        "images": [{
          "id": 600384949036810200,
          "id_str": "600384949036810240",
          "media_url": "http://pbs.twimg.com/media/CFT-7h_UgAAlPbQ.jpg",
          "media_url_https": "https://pbs.twimg.com/media/CFT-7h_UgAAlPbQ.jpg",
          "url": "http://t.co/mYKYjj8D0I",
          "display_url": "pic.twitter.com/mYKYjj8D0I",
          "expanded_url": "http://twitter.com/a8a3d2/status/600384949892550656/photo/1"
        }]
      });
    });
  });
});
