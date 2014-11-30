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

  //Run the full integration test via the shell
  grunt.config('shell.integration', {
    command: 'cd test/default && grunt --coverage && ./clean.sh'
  });

  var tasks = config.defaultTasks.concat(['shell:integration']);
  grunt.registerTask('default', tasks);
};
