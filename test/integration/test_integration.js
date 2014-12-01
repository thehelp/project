'use strict';

describe('integration', function() {
  it('sets VAR environment variable', function() {
    if (!process.env.VAR) {
      throw new Error('VAR environment variable was not set!');
    }
  });

  it('sets VALUE_FROM_JS environment variable', function() {
    if (!process.env.VALUE_FROM_JS) {
      throw new Error('VALUE_FROM_JS environment variable was not set!');
    }
  });
});
