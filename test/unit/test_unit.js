'use strict';

describe('unit', function() {
  it('should run this test', function() {
    if (!process.env.VAR) {
      throw new Error('VAR environment variable was not set!');
    }
  });

  it('jshint should not choke on this', function() {
    // This violates jshint W030:
    //   "Expected an assignment or function call and instead saw an expression"
    5;
  });
});
