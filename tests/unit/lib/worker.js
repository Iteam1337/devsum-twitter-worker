'use strict';

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('/lib/worker', function () {
  var worker;
  var T;
  var twit;
  var stream;
  var nconf;
  var mocks;

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

    mocks = require(process.cwd() + '/tests/mocks.json');

    worker = proxyquire(process.cwd() + '/lib/worker', {
      twit: twit,
      nconf: nconf
    });
  });

  describe('#listen', function () {
    it('should create a new Twitter stream', function () {
      nconf.get.returns({
        foo: 'bar'
      });

      worker.listen();

      expect(twit).calledOnce;
      expect(twit).calledWith({
        foo: 'bar'
      });
    });

    it('should filter twitter statuses by the word devsum15', function () {
      worker.listen();

      expect(T.stream).calledOnce;
      expect(T.stream).calledWith('statuses/filter', {
        track: 'devsum15'
      });
    });

    describe('on tweet', function () {
      it('should handle a new tweet', function () {
        var tweet = mocks.tweet;

        worker.listen();
        stream.on.withArgs('tweet').yield(tweet);
      });
    });
  });
});
