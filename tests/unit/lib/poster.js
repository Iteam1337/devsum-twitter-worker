'use strict';

var proxyquire = require('proxyquire');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('/lib/poster', function () {
  var poster;
  var nconf;

  beforeEach(function () {
    nconf = {
      env: sinon.stub(),
      file: sinon.spy(),
      get: sinon.stub()
    };

    nconf.env.returns(nconf);

    poster = proxyquire(process.cwd() + '/lib/poster', {
      nconf: nconf
    });
  });

  describe('#send', function () {
    it('should send the new tweet to the API', function () {
      var tweet = {
        foo: 'bar'
      };

      poster.send(tweet);
    });
  });
});
