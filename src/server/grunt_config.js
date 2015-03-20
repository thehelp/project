/*
# GruntConfig
Configures grunt-based automation for the project. Just create an instance of this
class, passing in `grunt`, then call `standardSetup()`.

Registration for specific scenario is in each of the `registerXXX()` methods below.
It's split out this way to keep related configuration in the same place, since
most scenarios have config points in different parts of the config tree:

1. loading the tasks themselves
2. task configuration
3. related watch tasks
4. related clean tasks
*/

'use strict';

var fs = require('fs');
var path = require('path');

function GruntConfig(grunt) {
  this.grunt = grunt;
}

module.exports = GruntConfig;

// ## Commonly-used Methods

// `standardSetup` sets up everything this project provides with the defaults.
// An easy one-stop shop.
GruntConfig.prototype.standardSetup = function(options) {
  options = options || {};

  this.setupTimeGrunt();
  this.registerWatch(options.watch);
  this.registerJsonLint(options.jsonLint);
  this.registerEnv(options.env);
  this.registerEnvJs(options.envJs);
  this.registerClean(options.clean);

  this.registerTest(options.test);
  this.registerStaticAnalysis(options.staticAnalysis);
  this.registerStyle(options.style);
  this.registerDoc(options.doc);

  this.registerShell(options.shell);
};

GruntConfig.prototype.defaultTasks = [
  'jsonlint', 'test', 'staticanalysis', 'style', 'doc'
];

// `standardDefault` installs a 'default' grunt handler (what runs when you just type
// 'grunt' on the command line) which does what you likely want it to do. You can get
// access to the list of tasks with the `defaultTasks` key.
GruntConfig.prototype.standardDefault = function() {
  this.grunt.registerTask('default', this.defaultTasks);
};

// ## Utility Methods

/*
`modifiedInLast` allows you to limit the scope of any participating task's target
files to the files modified in the last X minutes. X is defined by supplying the
'partial' option on the command line. For example:

```
grunt watch:doc --partial=2
```
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
// pulls locally-installed modules. The whole point of this project is to take the
// difficulty out of using all of these grunt plugins. This method ensures that
// any project using 'thehelp-project' needs only add 'thehelp-project' as a dependency,
// not the various grunt plugins.
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

// `registerJsonLint` sets up the `jsonlint` task to ensure JSON is well-formed (giving
// far better error messages than a basic `JSON.parse`). Set up by default to lint every
// *.json file in the root directory of the project.
GruntConfig.prototype.registerJsonLint = function(options) {
  this.loadLocalNpm('grunt-jsonlint');

  this.grunt.config('jsonlint', options || {
    default: {
      src: ['*.json']
    }
  });
};

// `registerEnv` sets up the `env` task to populate environment variables. By default it
//  uses data from 'env.json' in the current working directory (the root of your project).
GruntConfig.prototype.registerEnv = function(options) {
  this.loadLocalNpm('grunt-env');

  this.grunt.config('env', options || {
    default: {
      src: 'env.json'
    }
  });
};

// `registerEnvJs` sets up the `env-js` task to populate environment variables. By default
// loads data from 'env.js' in the current working directory (the root of your project).
GruntConfig.prototype.registerEnvJs = function(options) {
  /*jshint maxcomplexity: 13 */
  var _this = this;

  this.grunt.registerMultiTask('env-js', function() {
    var files = this.filesSrc;
    var pathSpecified = true;

    if (!files || !files.length) {
      if (this.files && this.files.length) {
        throw new Error('Supplied file does not exist!');
      }

      pathSpecified = false;
      files = ['env.js'];
      if (_this.grunt.option('verbose')) {
        _this.grunt.log.warn('No files specified; loading default file <CWD>/env.js');
      }
    }

    if (files.length > 1) {
      throw new Error('Too many files specified');
    }

    try {
      var file = path.resolve(files[0]);
      var env = require(file);
      if (env) {
        for (var key in env) {
          if (env.hasOwnProperty(key) && typeof process.env[key] === 'undefined') {
            process.env[key] = env[key];
          }
        }
      }
    }
    catch (e) {
      if (pathSpecified) {
        throw e;
      }
      if (_this.grunt.option('verbose')) {
        _this.grunt.log.warn(e.stack);
      }
    }
  });

  this.grunt.config('env-js', options || {
    default: {}
  });
};

// `registerClean` deletes directories as specified in options, or in
// three default directories: 'dist,' 'tmp,' and 'public.
GruntConfig.prototype.registerClean = function(options) {
  this.loadLocalNpm('grunt-contrib-clean');

  this.grunt.config('clean', options || {
    dist: {
      src: ['dist/**/*']
    },
    tmp: {
      src: ['tmp/**/*']
    },
    public: {
      src: ['public/**/*']
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
+ bail: use this to cause the mocha run to stop after the first failed test

_Note: the 'partial' option will force you to save the test files themselves to get tests
to run, since that's the set of files supplied to mocha. Even if we watch all files, we
still provide only the set of test-containing files to mocha._
*/
GruntConfig.prototype.registerTest = function(options) {
  /*jshint maxcomplexity: 13 */

  options = options || {};
  options.src = options.src || ['src/**/*.js', '*.js', 'tasks/**/*.js'];

  //a little weird, because we need to support both cli and istanbul options
  var coverage = this.grunt.option('coverage');
  var mochaModule = coverage ? 'grunt-mocha-istanbul' : 'grunt-mocha-cli';
  this.loadLocalNpm(mochaModule);

  //istanbul-specific:
  options.reportFormats = ['html', 'lcov'];
  options.mochaOptions = options.mochaOptions || [];
  if (this.grunt.option('bail')) {
    options.mochaOptions.push('--bail');
  }

  //both
  options.reporter = options.reporter || this.grunt.option('reporter') || 'spec';
  if (typeof options.grep === 'undefined') {
    options.grep = this.grunt.option('grep');
  }

  //cli-specific
  if (typeof options.bail === 'undefined') {
    options.bail = this.grunt.option('bail');
  }

  var mochaName = coverage ? 'mocha_istanbul' : 'mochacli';
  this.grunt.config(mochaName, {
    unit: {
      src: ['test/unit/**/*.js', '!test/unit/client/**'],
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    integration: {
      src: ['test/integration/**/*.js', '!test/integration/client/**'],
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    manual: {
      src: ['test/manual/**/*.js', '!test/manual/client/**']
    },
    all: {
      src: [
        'test/unit/**/*.js', '!test/unit/client/**',
        'test/integration/**/*.js', '!test/integration/client/**',
        'test/manual/**/*.js', '!test/manual/client/**'
      ]
    },
    options: options
  });

  this.grunt.config('watch.unit', {
    files: options.src.concat('test/unit/**/*.js'),
    tasks: ['unit']
  });
  this.grunt.config('watch.integration', {
    files: options.src.concat('test/integration/**/*.js'),
    tasks: ['integration']
  });

  var prefix = ['env:default', 'env-js:default'];
  this.grunt.registerTask('unit', prefix.concat([mochaName + ':unit']));
  this.grunt.registerTask('integration', prefix.concat([mochaName + ':integration']));
  this.grunt.registerTask('manual', prefix.concat([mochaName + ':manual']));
  this.grunt.registerTask('test-all', prefix.concat([mochaName + ':all']));

  this.grunt.registerTask('test', ['unit', 'integration']);
};

/*
`registerStaticAnalysis` sets up two tasks: 'jshint' and 'complexity.' It also sets up the
ability to run both of these whenever any javascript file changes in tne project. Within
the 'jshint' task we create two sub-tasks: 'src' and 'test.' Test has a
frequently-encountered rule turned off.

_Note: Participates in the 'partial' filtration option._
*/
GruntConfig.prototype.registerStaticAnalysis = function(options) {
  /*jshint maxcomplexity: 9 */

  options = options || {};

  options.src = options.src || ['src/**/*.js', '*.js', 'tasks/**/*.js'];
  options.test = options.test || ['test/**/*.js'];
  options.all = options.all || options.src.concat(options.test);

  options.jshintrc = options.jshintrc || path.join(__dirname, '../../.jshintrc');

  this.loadLocalNpm('grunt-contrib-jshint');
  this.grunt.config('jshint', {
    src: {
      src: options.src,
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    test: {
      src: options.test,
      options: {
        //Off: "Expected an assignment or function call and instead saw an expression"
        '-W030': true
      },
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    options: this.grunt.file.readJSON(options.jshintrc)
  });

  this.loadLocalNpm('grunt-complexity');
  this.grunt.config('complexity', {
    all: {
      src: options.all,
      exclude: options.exclude,
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
    files: options.all,
    tasks: ['staticanalysis']
  });

  this.grunt.registerTask('staticanalysis', ['jshint', 'complexity']);
  this.grunt.registerTask('sa', ['staticanalysis']);
};

/*
`registerStyle` sets up one task: 'jscs' with a default set of rules. You can
specify your path to a JSON config file with the `jscsrc` key.

Check the [jscs readme](https://github.com/mdevils/node-jscs) for more information on
what it does.

_Note: Participates in the 'partial' filtration option._
*/
GruntConfig.prototype.registerStyle = function(options) {
  options = options || {};

  options.all = options.all ||
    ['src/**/*.js', '*.js', 'tasks/**/*.js', 'test/**/*.js'];

  options.jscsrc = options.jscsrc || path.join(__dirname, '../../.jscsrc');

  this.loadLocalNpm('grunt-jscs');
  this.grunt.config('jscs', {
    all: {
      src: options.all,
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    options: this.grunt.file.readJSON(options.jscsrc)
  });

  this.grunt.config('watch.style', {
    files: options.all,
    tasks: ['jscs']
  });

  this.grunt.registerTask('style', ['jscs']);
};

/*
`registerDoc` uses `groc` to process markdown comments in source files into
nice documentation files in HTML. It also uses a custom-developed
[`fix-groc-stylesheet`](../../tasks/fix_groc_stylesheet.html) task to do better
than the default groc stylesheet, recopied on every run.

_Note: Participates in the 'partial' filtration option. Highly recommended when making
many edits to one file, as groc runs take a long time. However, note that 'behavior.js',
which contains site navigation javascript data, will generated as if only the files passed
to it are available. You'll need to do a final complete run to restore your complete
'behavior.js.'_
*/
GruntConfig.prototype.registerDoc = function(options) {
  options = options || {};

  options.all = options.all || ['src/**/*.js', 'tasks/**/*.js', '*.js', '*.md'];
  options.out = options.out || 'docs/';

  this.loadLocalNpm('grunt-groc');
  this.grunt.config('groc', {
    all: {
      src: options.all,
      filter: this.grunt.option('partial') ? this.modifiedInLast() : null
    },
    options: {
      out: options.out,
      github: options.github || this.grunt.option('publish-docs') || false
    }
  });

  this.grunt.config('watch.doc', {
    files: options.all,
    tasks: ['doc']
  });

  this.grunt.config('clean.doc', {
    src: ['docs/src/**/*', 'docs/tasks/**/*', 'docs/*.html']
  });

  this.grunt.registerTask('doc', ['groc']);
};

/*
`registerCopy` uses the `grunt-contrib-copy` task to copy files. You can provide your
set of file copies file by file:

```javascript
registerCopy({
  files: {
    'target': 'source',
    'dist/mocha.css': 'lib/vendor/mocha.css',
    'dist/harness.js': 'src/client/harness.js'
  }
})
```

Or in wildcard groups like this:

```javascript
registerCopy({
  files: [{
    expand: true,
    cwd: path.join('node_modules', module, 'dist'),
    src: ['*.js'],
    dest: 'lib/vendor'
  }]
})
```

[More information on configuring file lists.](http://gruntjs.com/configuring-tasks#files)
If no options are specified, this method will simply pull in the copy task
for your customization.
*/
GruntConfig.prototype.registerCopy = function(options) {
  if (!this.copyRegistered) {
    this.loadLocalNpm('grunt-contrib-copy');
    this.copyRegistered = true;
  }

  if (options) {
    this.grunt.config('copy.default', options);
  }
};

/*
`registerShell` makes the 'shell' task available if no options are required. Here's an
example of how to add `bower install` to your grunt tasks:

```javascript
registerShell({
  'bower-install': {
     command: 'bower install',
     options: {
       failOnError: true
     }
   }
})
```
*/
GruntConfig.prototype.registerShell = function(options) {
  this.loadLocalNpm('grunt-shell');

  if (options) {
    this.grunt.config('shell', options);
  }
};
