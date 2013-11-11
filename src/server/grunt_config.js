/*
# GruntConfig
Configures grunt-based automation for the project. Just create an instance of this
class, passing in `grunt`, then call `registerAll`.

Registration for specific scenario is in each of the 'register-' methods below.
It's split out this way to keep related configuration in the same place, since
most scenarios have three major config points:

1. loadTasks/loadNpmTasks calls
2. overall task configuration
3. any related watch tasks
*/

'use strict';

var fs = require('fs');
var path = require('path');

function GruntConfig(grunt) {
  this.grunt = grunt;
}

// ## Commonly-used Methods

// `standardSetup` sets up everything this project provides with the defaults.
// An easy one-stop shop.
GruntConfig.prototype.standardSetup = function() {
  this.setupTimeGrunt();
  this.registerWatch();
  this.registerEnv();
  this.registerClean();

  this.registerTest();
  this.registerStaticAnalysis();
  this.registerDoc();
};

// `standardDefault` intalls a 'default' grunt handler (what runs when you just type
// 'grunt' on the command line) which does what you likely want it to do.
GruntConfig.prototype.standardDefault = function() {
  this.grunt.registerTask('default', ['test', 'staticanalysis', 'doc']);
};

// ## Utility Methods

/*
`modifiedInLast` allows you to limit the scope of any participating task's target
files to the files modified in the last X minutes. X is defined by supplying the
'partial' option on the command line. For example:

    grunt watch:doc --partial=2
*/
GruntConfig.prototype.modifiedInLast = function() {
  var minutes = parseInt(this.grunt.option('partial'), 10);

  return function(file) {
    if (isNaN(minutes)) {
      return true;
    }

    var now = new Date();
    var updated = fs.statSync(file).mtime.getTime();
    var minutesAgo = now.getTime() - minutes * 60 * 1000;
    return (updated > minutesAgo);
  };
};

// `loadLocalNpm` gets around the limitation in `grunt.loadNpmTasks` - that it always
// pulls locally-installed modules. The whole point of this project is to take the difficulty out of
GruntConfig.prototype.loadLocalNpm = function(name, root, delta) {
  root = root || __dirname;
  delta = delta || '../..';

  var tasks = path.join(root, delta, 'node_modules', name, 'tasks');

  this.grunt.loadTasks(tasks);
};

// ## Specific Scenarios

GruntConfig.prototype.setupTimeGrunt = function() {
  var timeGrunt = require('time-grunt');
  timeGrunt(this.grunt);
};

// `registerWatch` sets up watch with no tasks, ready for other registration
// functions to add them.
GruntConfig.prototype.registerWatch = function(options) {
  this.loadLocalNpm('grunt-contrib-watch');

  this.grunt.config('watch', options || {
    options: {
      debounceDelay: 200
    }
  });
};

// `registerEnv` sets up the `env` task to populate environment variables
// in the current context.
GruntConfig.prototype.registerEnv = function(options) {
  this.loadLocalNpm('grunt-env');

  this.grunt.config('env', options || {
    all: {
      src: 'env.json'
    }
  });
};

// `registerClean` deletes directories as specified in options, or in
// two default directories: 'public' and 'tmp.'
GruntConfig.prototype.registerClean = function(options) {
  this.loadLocalNpm('grunt-contrib-clean');

  this.grunt.config('clean', options || {
    public: {
      src: ['public/**/*']
    },
    tmp: {
      src: ['tmp/**/*']
    }
  });
};

/*
`registerTest` does everything required to get a number of test-related
tasks in place, including the ability to run unit tests whenever a test
or source file is changed.

Several options are supported by this set of tasks:

+ coverage: when truthy, the reporter will be set to 'html-cov', and `blanket`
will automatically required
+ reporter: when 'coverage' is not set, you can customize the reporter to anything
you'd like. I prefer 'dot' when running under a watch task, for example.
+ grep: use this to limit your run to specific tests
+ bail: use this to cause the mocha run to stop after the first

_Note: the 'partial' option will force you to save the test-side of a given
test target to get the tests to run, since our filter only sees the test
files, not the source files. Even if it did, supplying those files to
mocha would result in no tests run._
*/
GruntConfig.prototype.registerTest = function() {
  this.loadLocalNpm('grunt-mocha-cli');

  this.grunt.config('mochacli', {
    unit: {
      src: ['test/unit/**/*.js', '!test/unit/client/**'],
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    integration: {
      src: ['test/integration/**/*.js', '!test/integration/client/**'],
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    interactive: {
      src: ['test/interactive/**/*.js', '!test/interactive/client/**']
    },
    all: {
      src: ['test/**/*.js', '!test/*/client/**', '!test/util/*'],
    },
    options: {
      reporter: this.grunt.option('coverage') ? 'html-cov' :
        this.grunt.option('reporter') || 'spec',
      require: this.grunt.option('coverage') ? ['blanket'] : [],
      grep: this.grunt.option('grep'),
      bail: this.grunt.option('bail') ? true : false,
    }
  });

  this.grunt.config('watch.unit', {
    files: ['src/**/*.js', 'test/unit/**/*.js'],
    tasks: ['unit']
  });
  this.grunt.config('watch.integration', {
    files: ['src/**/*.js', 'test/integration/**/*.js'],
    tasks: ['integration']
  });

  this.grunt.registerTask('unit', ['env', 'mochacli:unit']);
  this.grunt.registerTask('integration', ['env', 'mochacli:integration']);
  this.grunt.registerTask('interactive', ['env', 'mochacli:interactive']);
  this.grunt.registerTask('test', ['env', 'unit', 'integration']);
};

/*
`registerStaticAnalysis` sets up two tasks: jshint and complexity.
It also sets up the ability to run both of these whenever any javascript
file changes in tne project.

_Note: Participates in the 'partial' filtration option._
*/
GruntConfig.prototype.registerStaticAnalysis = function() {
  this.loadLocalNpm('grunt-contrib-jshint');

  var jsFiles = ['src/**/*.js', '*.js', 'tasks/**/*.js', 'test/**/*.js'];

  this.grunt.config('jshint', {
    all: {
      src: jsFiles,
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    options: this.grunt.file.readJSON('.jshintrc')
  });

  this.loadLocalNpm('grunt-complexity');
  this.grunt.config('complexity', {
    all: {
      src: jsFiles,
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    options: {
      errorsOnly: false,
      maintainability: 90,

      //we're not using these, so setting high
      cyclomatic: Infinity,
      halstead: Infinity
    }
  });

  this.grunt.config('watch.staticanalysis', {
    files: jsFiles,
    tasks: ['staticanalysis']
  });

  this.grunt.registerTask('staticanalysis', ['jshint', 'complexity']);
};

/*
`registerDoc` uses `groc` to process markdown comments in source files into
nice documentation files in HTML. It also uses a custom-developed
[`fix-groc-stylesheet`](../../tasks/fix_groc_stylesheet.html) task to do better
than the default groc stylesheet, recopied on every run.

_Note: Participates in the 'partial' filtration option. Highly recommended,
as groc runs take a long time._
*/
GruntConfig.prototype.registerDoc = function(files) {
  this.grunt.loadTasks(path.join(__dirname, '../../tasks'));

  files = files || ['src/**/*.js', 'tasks/**/*.js', '*.js', 'README.md'];

  this.loadLocalNpm('grunt-groc');
  this.grunt.config('groc', {
    all: {
      src: files,
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    options: {
      out: 'docs/'
    }
  });

  this.grunt.config('watch.doc', {
    files: files,
    tasks: ['doc']
  });

  this.grunt.config('clean.doc', {
    src: ['docs/src/**/*', 'docs/tasks/**/*', 'docs/*.html']
  });

  this.grunt.registerTask('doc', ['groc', 'fix-groc-stylesheet']);
};

module.exports = GruntConfig;
