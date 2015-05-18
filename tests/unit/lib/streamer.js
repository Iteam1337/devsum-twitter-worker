'use strict';

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('/lib/streamer', function () {
  var streamer;
  var T;
  var twit;
  var stream;
  var nconf;
  var mocks;
  var poster;

  beforeEach(function () {
    stream = {
      on: sinon.stub()
    };

    T = {
      stream: sinon.stub().returns(stream)
    };

    twit = sinon.stub().returns(T);

    nconf = {
      env: sinon.stub(),
      file: sinon.spy(),
      get: sinon.stub()
    };

    nconf.env.returns(nconf);

    poster = {
      send: sinon.spy()
    };

    mocks = require(process.cwd() + '/tests/mocks.json');

    streamer = proxyquire(process.cwd() + '/lib/streamer', {
      twit: twit,
      nconf: nconf,
      './poster': poster
    });
  });

  describe('#listen', function () {
    it('should create a new Twitter stream', function () {
      nconf.get.returns({
        foo: 'bar'
      });

      streamer.listen();

      expect(twit).calledOnce;
      expect(twit).calledWith({
        foo: 'bar'
      });
    });

    it('should filter twitter statuses by the word devsum15', function () {
      streamer.listen();

      expect(T.stream).calledOnce;
      expect(T.stream).calledWith('statuses/filter', {
        track: 'devsum15'
      });
    });

    describe('on tweet', function () {
      it('should handle a new tweet', function () {
        var tweet = mocks.tweet;

        streamer.listen();
        stream.on.withArgs('tweet').yield(tweet);

        expect(poster.send).calledOnce;
        expect(poster.send).calledWith(tweet);
      });
    });
  });
});
