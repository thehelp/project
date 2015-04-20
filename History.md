## 3.5.1 (2015-04-20)

* Minor version updates: `grunt-jscs`, `grunt-mocha-cli`, `grunt-mocha-istanbul`, `mocha`
* Patch updates: `grunt-contrib-jshint`, `istanbul`, `time-grunt`
* Update dependencies included for de-duping. This set of dependencies, which includes manually breaking conflicts ‘npm dedupe' doesn’t help with, saves about 9MB.
* Update dev dependencies

## 3.5.0 (2015-03-20)

* `groc` updated to `0.8.0` - easier to set up and faster! No longer requires Python Pygments module, and does work to determine what documentation should be generated before running.
* Fix: `env:default` and `env-js:default` are now run before all the test-related aliases, instead of just `env` and `env-js`. This allows you to create `env`/`env-js` sub tasks in your gruntfile and use them in other contexts.

* Minor version updates: `grunt-complexity`, `grunt-contrib-copy`, `grunt-contrib-jshint`, `grunt-mocha-istanbul`, `time-grunt`
* Patch updates: `istanbul`, `grunt-env`, `grunt-mocha-cli`, `grunt-shell`

* Tested against node `0.12.0` and io.js `1.4.3` and above - five total platforms are now included in all [Travis CI runs](https://travis-ci.org/thehelp/project)
* Did some work to de-duplicate dependencies. node_modules directory was at 52MB before the work, at 46MB after.
* Tuned the npm package a little

## 3.4.1 (2015-02-24)

* `options.staticAnalsis.excludes` can now hold an array of file paths to be excluded from the jscomplexity step. Some files (especially configuration) just aren't worth the work to take the complexity down.

## 3.4.0 (2014-12-04)

* Fix bug: pass `options.jsonLint` to `registerJsonLint()` instead of `options.env`
* New: `env-js` task loading environment variables from 'env.js' by default, run before all test tasks, after `env` task
* `--coverage` option now uses `grunt-mocha-istanbul` instead of locally-installed `blanket` and htmlcov `mocha` reporter. Far easier to use.
* `test-all` task now includes only unit, integration and manual tests. Cleaner than previous implementation, which would load any files matching 'test/**/*.js', excluding only 'test/*.js' or 'test/unit/*.js'.
* Custom options can now be supplied to `registerTest()` or as `test` key provided to `standardSetup()` - including `excludes` key to customize which files and folders are instrumented for code coverage.
* Major version update: `grunt-jscs`
* Minor version updates: `grunt-contrib-copy`, `grunt-mocha-cli`, `grunt-shell`
* Patch update: `grunt-env`
* Update dev dependencies
* Note: `groc` kept back for now, despite available updates

## 3.3.1 (2014-08-27)

* Update `groc` to version that doesn't fall prey to breaking changes in `underscore` 1.7
* Major version updates: `grunt-shell`, `time-grunt` (strange; these don't seem to introduce breaking changes)
* Minor version updates: `grunt-mocha-cli`

## 3.3.0 (2014-07-31)

* `jsonlint` task added to default - verifies that *.json files in root dir are well-formed
* Minor version updates: `grunt-contrib-clean`, `time-grunt`
* Patch updates: `grunt-jscs` (moving to new name; previously `grunt-jscs-checker`)
* Update dev dependencies

## 3.2.0 (2014-06-23)

* `doc` command can now take a truthy `github` key or '--publish-docs' command-line option to publish docs to github pages
* Upgrade to a newer version of `groc` fork, and remove 'fix-groc-stylesheet' task, since the vertical space tweaks are in `groc`'s stylesheet. This was needed for github pages publish.
* TravisCI support

## 3.1.0 (2014-06-23)

* '.md' files in the root directory now processed to 'docs/*.html' by doc task
* Patch updates: `time-grunt`
* Minor version updates: `grunt-complexity`, `grunt-jscs-checker`, `grunt-mocha-cli`
* Remove docs directory from repo
* Add high-level stuff to readme

## 3.0.0 (2014-06-07)

* Every `registerXXX()` method now takes one options parameter, looking for keys on it, instead of direct parameters.
* `standardSetup()` now takes an `options` parameter, allowing for full customization without calling `registerXXX()` methods directly. `options.watch` is passed to `registerWatch()`, for example.
* `grunt interactive` is now `grunt manual` (still excluded from `grunt test` and included in `grunt test-all`)
* Overhaul of all documentation
* All client-side development task configuration removed, to be released in a forthcoming `thehelp-client-project`: `registerConnect()`, `registerMocha()`, `registerOptimize()`, `registerCopyFromBower()` and `registerCopyFromDist()`
* Update to latest version of my `groc` fork
* Update dev dependencies

## 2.5.2 (2014-05-27)

* Pare down what's in npm package

## 2.5.1 (2014-05-26)

* Turn off `jscs` option 'requireCamelCaseOrUpperCaseIdentifiers' since there's no mechanism for exceptions, and we do need to interact with external services whose parameters are often not in camelcase. `jshint` already covers this anyway.

## 2.5.0 (2014-05-21)

* add new 'style' task based on the style checking capabilities of [`jscs`](https://github.com/mdevils/node-jscs). Take a look at `.jscsrc` in the root directory for the default set of rules. You can supply a path to the second parameter of `registerStyle` to provide your own config file, and you might want to, since it's pretty opinionated.
* Update some dev dependencies

## 2.4.6 (2014-05-17)

* split 'jshint:all' task into 'test' and 'src' tasks. 'test' task has one warning turned off:

  - -W030: Expected an assignment or function call and instead saw an expression

## 2.4.5 (2014-04-28)

* task 'mochacli:all' properly excludes javascript files in the root test folder
* Minor version updates: `grunt-shell`
* Patch updates: `grunt-requirejs`

## 2.4.4 (2014-04-02)

* Updated minor versions: `grunt-contrib-jshint`, `grunt-mocha-cli`
* Updated patch versions: `grunt-complexity`

## 2.4.3 (2014-03-27)

* Added 'sa' alias for the combined jshint/complexity 'staticanalysis' task

## 2.4.2 (2014-03-21)

* Patch versions: groc (actually a no-op change; fixing tag version to match package.json)
* Minor versions: grunt-contrib-jshint (better error output! woo!), grunt-contrib-watch, grunt-mocha-cli, time-grunt (color!)
* Dev dependencies: chai, grunt

## 2.4.1 (2014-03-13)

* Upgrading to [groc@0.6.4 (from my branch)](https://github.com/scottnonnenberg/groc/releases/tag/v0.6.4). Pulls in `jade` 1.x, something that the main `groc` project has resisted doing. But it didn't even change the generated documentation.

## 2.4.0 (2014-03-09)

* `registerOptimize()` now turns on source map generation unless it's been explicitly configured.

## 2.3.0 (2014-03-07)

* Patch updates: grunt-complexity, grunt-groc, grunt-mocha, grunt-requirejs, grunt-shell, time-grunt, grunt
* Minor version updates: chai, sinon
* Minor version below v1 (could be breaking changes): grunt-contrib-connect, grunt-contrib-connect, grunt-contrib-jshint

## 2.2.0 (2013-12-23)

* Turn on 90-character limit per line

## 2.1.4 (2013-12-22)

* Update to my fork of `groc` which prevents it from being broken after `jade` 1.0.0 release

## 2.1.3 (2013-12-21)

* Fix crash if 'bower_components' folder doesn't exist

## 2.1.2 (2013-12-16)

* updating minor version: `grunt-mocha-cli` (now at mocha 1.15, also has my [pull request](https://github.com/Rowno/grunt-mocha-cli/pull/8))
* updating patch version: `grunt-env`, `grunt-mocha`, `time-grunt` (time grunt update actually brings its output back under `grunt` 0.4.2)

## 2.1.1 (2013-12-14)

* adding `async` to `bowerSpecialCases`

## 2.1.0 (2013-12-02)

* new: task 'test-all' for easy code coverage testing

## 2.0.0 (2013-12-02)

* `registerCopy()` now takes options param, not files
* `registerCopyFromDist()` now creates just one target
* new: `registerInstall()` for 'npm/bower install'
* new: 'setup' task for installing dependencies

## 1.4.1 (2013-11-30)

* can use `bowerSpecialCases` to customize the behavior of `registerCopyFromBower()`. two special-cases are included by default: lodash (dist/lodash.compat.js) and requirejs (require.js)

## 1.4.0 (2013-11-29)

* new method: `registerCopyFromBower()` - pulls javascript files installed by bower into your lib/vendor directory
* `registerCopy()` can be called more than once; also called by `registerCopyFromBower()` and `registerCopyFromDist` to ensure `grunt-contrib-copy` task is ready for use
* dependency update: latest versions of lodash, grunt-contrib-jshint, grunt-mocha, time-grunt, and grunt

## 1.3.0 (2013-11-22)

* registerTest: now allows customization of source files to ensure that your 'run-on-change' task behaves properly

## 1.2.3 (2013-11-22)

* Re-ordering parameters in registerStaticAnalysis (now it's files first, then jshintrc path)

## 1.2.2 (2013-11-19)

* Fix to registerOptimize: fix task name collision for multiple libraries based off of the same root javascript file

## 1.2.1 (2013-11-19)

* Fix to registerOptimize: allow multiple libraries based off of the same root javascript file (take name for task from the output file, not the input file)

## 1.2.0 (2013-11-18)

* new method: `registerCopyFromDist()` - pulls files out of `dist/` folders of installed node modules
* `registerCopy()` files parameter now optional

## 1.1.0 (2013-11-17)

* new method: `registerCopy()` - pulls in `grunt-contrib-copy` task, passes `files` parameter to it
* new method: `registerConnect()` - sets up two targets: test (port 3001) and keepalive (port 3000)
* new method: `registerOptimize()` - uses `grunt-requirejs` to optimize and concatenate AMD files, producing unoptimized and, if requested, standalone files based on almond.js
* new method: `registerMocha()` - running phantomjs-based in-browser unit tests. Works well with `registerConnect()`

## 1.0.3 (2013-11-14)

* adding 'dist' target to  `registerClean()`

## 1.0.2 (2013-11-11)

* `registerStaticAnalysis()` uses .jshintrc file inside this project by default, to make it that much easier to set up a new project.

## 1.0.1 (2013-11-11)

* new: `loadLocalNpm()` loads tasks from node modules installed as dependencies of this library, not from the project which is using this library.

## 1.0.0 (2013-11-11)

* Initial release
* time-grunt, env, testing with mocha-cli, jshint, complexity, groc and fix-groc-stylesheet, clean, watch, filter, code coverage support in testing
