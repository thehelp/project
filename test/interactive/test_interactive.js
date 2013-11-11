'use strict';

describe('interactive', function() {
  it('should run this test', function() {
    if (!process.env.VAR) {
      throw new Error('VAR environment variable was not set!');
    }
  });
});
