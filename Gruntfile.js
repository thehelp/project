// # Gruntfile
// Automation for the project.

'use strict';

var GruntConfig = require('./src/server/index').GruntConfig;

// We simply create an instance of the [`GruntConfig`](./src/server/grunt_config.html)
// object, then take all the defaults.
module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();
};
