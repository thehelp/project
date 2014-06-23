// # fix-groc-stylesheet
// This grunt task should be run after the `groc` task to ensure that we
// keep the CSS updates required to make its output look reasonable.
'use strict';

var path = require('path');

// You can supply your own `source` on the grunt configuration for this task and it will
// override the default supplied here.
module.exports = function(grunt) {
  grunt.registerTask('fix-groc-stylesheet', 'Replace generated groc style sheet.',
    function() {
      var options = this.options({
        source: path.join(__dirname, '../src/style.css'),
        target: 'docs/assets/style.css'
      });

      grunt.file.copy(options.source, options.target);
    }
  );
};
