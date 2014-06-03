# thehelp-project

This project is designed to get high quality grunt-based project automation in place very quickly.

## Features

Grunt task setup:

* `time-grunt`
* `env`, loading environment variables from env.json
* `mocha-cli` for 'unit', 'integration' and 'manual' tasks, running everything underneath 'test/<test type>' excluding the 'client' subdirectory
* command-line options supported for tests: 'grep', 'coverage', 'reporter' and 'bail'
* staticanalysis, encompassing two tasks: `jshint` and `complexity`
* style, using the highly-configurable `jscs`
* doc, wrapping two tasks: `groc` and `fix-groc-stylesheet`
* `watch` core setup and subtasks for tests, static analysis, style and documentation generation
* `modifiedInLast()` method to filter files processed using the grunt 'partial' command-line option
* `clean`, deleting 'public/*', 'tmp/*', and 'dist/*' by default, and extended to include files under doc if you call `registerDoc()`

## Setup

First, install the project as a dev dependency:

```
npm install thehelp-project --save-dev
```

Then make sure you have the grunt command available:

```
npm install -g grunt-cli
```

### Code coverage

To use code coverage functionality, you'll need to have [`blanket`](https://github.com/alex-seville/blanket) installed as a dev dependency at the top level in your project:

```
npm install blanket --save-dev
```

In your package.json you'll need some configuration information to let Blanket know which files you wnat to instrument for code coverage. I usually use something like this:

```
  "config": {
    "blanket": {
      "data-cover-only": "src",
      "data-cover-never": "['lib/','node_modules/','test/','src/client']"
    }
  },
```

### Documentation generation

To use [`groc`](https://github.com/nevir/groc)-based documentation generation, you'll need to have [Pygments](http://pygments.org/docs/installation/) installed. On OSX, the easiest way to install it is:

```
sudo easy_install Pygments
```

Even on non-OSX, `easy_install` is still the the right way to install it. You'll just need to pull down [Python](http://www.python.org/getit/) to get it.

### Expected project structure

The easiest way to use this project is to take all the defaults. Of course, this means that you'll have to structure your project in the way the project expects:

```
├ README.md       becomes doc/index.html
├ env.json        environment variables needed by your project
├ docs/           all groc-generated doc files added here
├ src/            core source files
├ tasks/          any grunt tasks your project exposes
└ test/
  ├ unit/         unit tests
  │ └ client/     files under client/ in all three test directories are excluded
  ├ integration/  integration tests
  └ manual/       manual tests (will not be run as part of 'grunt test')
```

### Your Gruntfile

Now, again using all the defaults, you can use this as your whole Gruntfile:

```javascript
var GruntConfig = require('thehelp-project').GruntConfig;

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();
};
```
Now you've got quite a few new grunt tasks available to you! You can take a look by typing `grunt --help`, or you can just type `grunt` and the default task will do quite a bit. Here are the details...

## Usage

### Testing

```
grunt unit
grunt integration
grunt manual

# just unit and integration tests
grunt test
# all three types of tests
grunt test-all

grunt test --bail
grunt test --grep searchPattern
grunt test --reporter nyan
grunt test-all --coverage > result.html && open result.html
```

### Static analysis

For static analysis delivered by `jshint` and `complexity`:

```
grunt sa
grunt staticanalysis
```

### Code style

For code style checking, delivered by `jscs`:

```
grunt style
```

### Generate documentation

To generate html files from markdown in your source files' comments `groc` is used.

```
grunt doc
```

### Clean

Three directories are registered by default: 'dist/', 'tmp/', and 'public/'. If you set documentation generation up with `standardSetup()` or call `registerDoc()` a fourth directory will be added: 'doc/'

```
grunt clean
grunt clean:tmp
grunt clean:dist
grunt clean:public
grunt clean:doc
```

## Advanced

### Watch

Five sub-tasks are supported for the `watch` file-watching task from `grunt-contrib-watch`:

* unit
* integration
* staticanalysis
* style
* doc

Because, for large projects, you may not want to run these entire tasks every time one file changes, a `partial` option is available which limits the set of files to the set modified in the last N minutes.

```
grunt watch:staticanalysis
grunt watch:doc --partial 3

# note: unit and integration only watch the test files
grunt watch:unit
```

### Going past the defaults

The first level of customization is adding to what `thehelp-project` provides. For example, if you'd like to add a new `clean` target, you can add to its grunt configuration with a targeted update:

```
grunt.config('clean.build', {
  src: ['build/**/*']
})
```

The next step is changing things by passing data to `standardSetup()`. For example, if you'd like to provide your own `jshint` and `jscs` rules, you can do this to load your own local config files:

```javascript
config.standardSetup({
  staticAnalysis: {
    jshintrc: '.jshintrc'
  },
  style: {
    jscsrc: '.jscsrc'
  }
})

```

If you would like to eliminate setup for a given task completely, you can always bypass the `standardSetup()` function. This example just loads what it needs - it will add test-related tasks later:

```javascript
this.setupTimeGrunt();
this.registerWatch();
this.registerEnv();
this.registerClean();

this.registerStaticAnalysis();
this.registerStyle();
this.registerDoc();
```

## Some additional notes

* groc - using my own fork
* blanket - using my own fork

## History

### 3.0.0 (2014-06-02)

* Every `registerXXX()` method now takes one options parameter, looking for keys on it, instead of direct parameters.
* `standardSetup()` now takes an options parameter. `options.watch` is passed to `registerWatch()`, for example.
* `grunt interactive` is now `grunt manual` (still excluded from `grunt test` and included in `grunt test-all`)
* Overhaul of this readme
* All client-side development task configuration removed, to be released in a forthcoming `thehelp-client-project`: `registerConnect()`, `registerMocha()`, `registerOptimize()`, `registerCopyFromBower()` and `registerCopyFromDist()`
* Update to latest version of my `groc` fork
* Update dev dependencies

### 2.5.2 (2014-05-27)

* Pare down what's in npm package

### 2.5.1 (2014-05-26)

* Turn off `jscs` option 'requireCamelCaseOrUpperCaseIdentifiers' since there's no mechanism for exceptions, and we do need to interact with external services whose parameters are often not in camelcase. `jshint` already covers this anyway.

### 2.5.0 (2014-05-21)

* add new 'style' task based on the style checking capabilities of [`jscs`](https://github.com/mdevils/node-jscs). Take a look at `.jscsrc` in the root directory for the default set of rules. You can supply a path to the second parameter of `registerStyle` to provide your own config file, and you might want to, since it's pretty opinionated.
* Update some dev dependencies

### 2.4.6 (2014-05-17)

* split 'jshint:all' task into 'test' and 'src' tasks. 'test' task has one warning turned off:

  - -W030: Expected an assignment or function call and instead saw an expression

### 2.4.5 (2014-04-28)

* task 'mochacli:all' properly excludes javascript files in the root test folder
* Minor version updates: `grunt-shell`
* Patch updates: `grunt-requirejs`

### 2.4.4 (2014-04-02)

* Updated minor versions: `grunt-contrib-jshint`, `grunt-mocha-cli`
* Updated patch versions: `grunt-complexity`

### 2.4.3 (2014-03-27)

* Added 'sa' alias for the combined jshint/complexity 'staticanalysis' task

### 2.4.2 (2014-03-21)

* Patch versions: groc (actually a no-op change; fixing tag version to match package.json)
* Minor versions: grunt-contrib-jshint (better error output! woo!), grunt-contrib-watch, grunt-mocha-cli, time-grunt (color!)
* Dev dependencies: chai, grunt

### 2.4.1 (2014-03-13)

* Upgrading to [groc@0.6.4 (from my branch)](https://github.com/scottnonnenberg/groc/releases/tag/v0.6.4). Pulls in `jade` 1.x, something that the main `groc` project has resisted doing. But it didn't even change the generated documentation.

### 2.4.0 (2014-03-09)

* `registerOptimize()` now turns on source map generation unless it's been explicitly configured.

### 2.3.0 (2014-03-07)

* Patch updates: grunt-complexity, grunt-groc, grunt-mocha, grunt-requirejs, grunt-shell, time-grunt, grunt
* Minor version updates: chai, sinon
* Minor version below v1 (could be breaking changes): grunt-contrib-connect, grunt-contrib-connect, grunt-contrib-jshint

### 2.2.0 (2013-12-23)

* Turn on 90-character limit per line

### 2.1.4 (2013-12-22)

* Update to my fork of `groc` which prevents it from being broken after `jade` 1.0.0 release

### 2.1.3 (2013-12-21)

* Fix crash if 'bower_components' folder doesn't exist

### 2.1.2 (2013-12-16)

* updating minor version: `grunt-mocha-cli` (now at mocha 1.15, also has my [pull request](https://github.com/Rowno/grunt-mocha-cli/pull/8))
* updating patch version: `grunt-env`, `grunt-mocha`, `time-grunt` (time grunt update actually brings its output back under `grunt` 0.4.2)

### 2.1.1 (2013-12-14)

* adding `async` to `bowerSpecialCases`

### 2.1.0 (2013-12-02)

* new: task 'test-all' for easy code coverage testing

### 2.0.0 (2013-12-02)

* `registerCopy()` now takes options param, not files
* `registerCopyFromDist()` now creates just one target
* new: `registerInstall()` for 'npm/bower install'
* new: 'setup' task for installing dependencies

### 1.4.1 (2013-11-30)

* can use `bowerSpecialCases` to customize the behavior of `registerCopyFromBower()`. two special-cases are included by default: lodash (dist/lodash.compat.js) and requirejs (require.js)

### 1.4.0 (2013-11-29)

* new method: `registerCopyFromBower()` - pulls javascript files installed by bower into your lib/vendor directory
* `registerCopy()` can be called more than once; also called by `registerCopyFromBower()` and `registerCopyFromDist` to ensure `grunt-contrib-copy` task is ready for use
* dependency update: latest versions of lodash, grunt-contrib-jshint, grunt-mocha, time-grunt, and grunt

### 1.3.0 (2013-11-22)

* registerTest: now allows customization of source files to ensure that your 'run-on-change' task behaves properly

### 1.2.3 (2013-11-22)

* Re-ordering parameters in registerStaticAnalysis (now it's files first, then jshintrc path)

### 1.2.2 (2013-11-19)

* Fix to registerOptimize: fix task name collision for multiple libraries based off of the same root javascript file

### 1.2.1 (2013-11-19)

* Fix to registerOptimize: allow multiple libraries based off of the same root javascript file (take name for task from the output file, not the input file)

### 1.2.0 (2013-11-18)

* new method: `registerCopyFromDist()` - pulls files out of `dist/` folders of installed node modules
* `registerCopy()` files parameter now optional

### 1.1.0 (2013-11-17)

* new method: `registerCopy()` - pulls in `grunt-contrib-copy` task, passes `files` parameter to it
* new method: `registerConnect()` - sets up two targets: test (port 3001) and keepalive (port 3000)
* new method: `registerOptimize()` - uses `grunt-requirejs` to optimize and concatenate AMD files, producing unoptimized and, if requested, standalone files based on almond.js
* new method: `registerMocha()` - running phantomjs-based in-browser unit tests. Works well with `registerConnect()`

### 1.0.3 (2013-11-14)

* adding 'dist' target to  `registerClean()`

### 1.0.2 (2013-11-11)

* `registerStaticAnalysis()` uses .jshintrc file inside this project by default, to make it that much easier to set up a new project.

### 1.0.1 (2013-11-11)

* new: `loadLocalNpm()` loads tasks from node modules installed as dependencies of this library, not from the project which is using this library.

### 1.0.0 (2013-11-11)

* Initial release
* time-grunt, env, testing with mocha-cli, jshint, complexity, groc and fix-groc-stylesheet, clean, watch, filter, code coverage support in testing


## License

(The MIT License)

Copyright (c) 2013 Scott Nonnenberg &lt;scott@nonnenberg.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
