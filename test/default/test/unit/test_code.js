
'use strict';

var expect = require('chai').expect;

var code = require('../../src/code');


describe('code', function() {
  it('returns "no"', function() {
    expect(code()).to.equal('no');
  });
});
