[![Build Status](https://travis-ci.org/thehelp/project.svg?branch=master)](https://travis-ci.org/thehelp/project)

# thehelp-project

This project is designed to get high quality grunt-based project automation in place very quickly, with just one entry in your package.json.

## Features

* [`time-grunt`](https://github.com/sindresorhus/time-grunt), tracking how long your grunt tasks take
* [`env`](https://github.com/jsoverson/grunt-env), loading environment variables from env.json
* [`mocha-cli`](https://github.com/Rowno/grunt-mocha-cli) for 'unit', 'integration' and 'manual' tasks, running [`mocha`](http://visionmedia.github.io/mocha/) tests underneath 'test/<test type>' excluding the 'client' subdirectory
* command-line options supported for tests: 'grep', 'reporter' and 'bail'
* Code coverage collected via [`grunt-mocha-istanbul`](https://github.com/pocesar/grunt-mocha-istanbul) when `--coverage` option is provided
* static analysis, using two tasks: [`jshint`](http://www.jshint.com/) and [`complexity`](https://github.com/philbooth/complexity-report)
* style checking, using the highly-configurable [`jscs`](https://github.com/mdevils/node-jscs)
* json linting, using [`jsonlint`](https://github.com/zaach/jsonlint)
* documentation generation via [`groc`](https://github.com/nevir/groc) (with a few stylesheet tweaks)
* [`watch`](https://github.com/gruntjs/grunt-contrib-watch) core setup and subtasks for tests, static analysis, style and documentation generation
* grunt 'partial' command-line option to cut down watch task run times (via `modifiedInLast()`)
* [`clean`](https://github.com/gruntjs/grunt-contrib-clean), deleting everything under 'public/', 'tmp/', and 'dist/' by default, and extended to include files under 'doc/' along with documentation generation setup

## Setup

First, install the project as a dev dependency:

```bash
npm install thehelp-project --save-dev
```

Then make sure you have the grunt installed locally and the `grunt` command available:

```bash
npm install grunt --save-dev
npm install -g grunt-cli
```

### Your Gruntfile

The easiest way to use this project is to take all the defaults. To do that, you can use this as your whole Gruntfile:

```javascript
var GruntConfig = require('thehelp-project').GruntConfig;

module.exports = function(grunt) {
  var config = new GruntConfig(grunt);

  config.standardSetup();
  config.standardDefault();
};
```
With just that you've got quite a few new grunt tasks available to you! You can take a look by typing `grunt --help`, or you can just type `grunt` and the default task will do quite a bit. But you may want to do a little more setup first...

### Expected project structure

To use all the defaults you'll have to structure your project the way `thehelp-project` expects:

```
├ README.md       becomes doc/index.html
├ FILENAME.md     becomes doc/FILENAME.html
├ env.json        environment variables needed by your project
├ src/            core source files
├ tasks/          any grunt tasks your project exposes
├ docs/           all groc-generated doc files added here
├ coverage/       istanbul code coverage reports generated here
└ test/
  ├ unit/         unit tests
  │ └ client/     files under client/ in all three test directories are excluded
  ├ integration/  integration tests
  └ manual/       manual tests (will not be run as part of 'grunt test')
```


## Usage

### Testing

Put some `mocha` tests in place, then try these commands:

```bash
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
grunt test-all --coverage
grunt test --coverage=true --bail
```

This last option will collect code coverage into the `coverage` directory, using a different, slower-starting grunt task. To customize the files instrumented for code coverage, provide custom options to the test command setup:

```javascript
config.standardSetup({
  test: {
    exclusions: ['src/legacy/**/*.js']
  }
});
```

_Note: when combining boolean options, be sure to include `=true` after any option which is followed by another option. `grunt` won't pick up the second option; it will be considered the value for the preceding option._

```bash
npm install blanket --save-dev
```

In your package.json you'll need some configuration information to let `blanket` know which files you want to instrument for code coverage. I usually use something like this:

```json
{
  "config": {
    "blanket": {
      "data-cover-only": "src",
      "data-cover-never": "['lib/','node_modules/','test/','src/client']"
    }
  }
}
```


### Static analysis

For static analysis delivered by `jshint` and `complexity`:

```bash
grunt sa
grunt staticanalysis
```

### Code style

For code style checking, delivered by `jscs`:

```bash
grunt style
```

### JSON lint

To ensure that all *.json files in the root directory of your project are well-formed:

```bash
grunt jsonlint
```

### Generate documentation

`groc` generates html files from markdown in your source files' comments. Take a look at the docs for this project for an example: [https://thehelp.github.com/project](https://thehelp.github.com/project) (navigation in the top-right).

```bash
grunt doc

# automatically publishes generated docs to github pages
grunt doc --publish-docs
```

Some tips:

* If you use multiline comments (`/* ... */`) then you can use lists and other multiline constructs. Use something other than `*` for list delimiters.
* You can exclude a given comment from the documentation by removing its leading space. Very useful for jshint exceptions: (`/*jshint camelcase: false */`)
* While `groc` generates to your target directory normally, it will generate into the root when publishing to github pages. For example, your readme/index.html will be in the root directory.

### Clean

Three directories are registered by default: 'dist/', 'tmp/', and 'public/'. If you set documentation generation up with `standardSetup()` or call `registerDoc()` a fourth directory will be added: 'doc/'

```bash
grunt clean
grunt clean:tmp
grunt clean:dist
grunt clean:public
grunt clean:doc
```

### Watch

Five sub-tasks are supported for the `watch` file-watching task from `grunt-contrib-watch`:

* unit
* integration
* staticanalysis
* style
* doc

Because, for large projects, you may not want to run these entire tasks every time one file changes, a `partial` option is available which limits the set of files to the set modified in the last N minutes.

```bash
grunt watch:staticanalysis
grunt watch:doc --partial 3
grunt watch:unit

# note: when filtering, you'll need to modify the test files
grunt watch:unit --partial 3
```

## Configuration

The first level of customization is adding to what `thehelp-project` provides. For example, if you'd like to add a new `clean` target, you can add to its grunt configuration with a targeted update:

```javascript
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

If you would like to eliminate setup for a given task completely, you can always bypass the `standardSetup()` function. This example just loads what it needs - it will add its own test-related tasks later:

```javascript
this.setupTimeGrunt();
this.registerWatch();
this.registerEnv();
this.registerClean();

this.registerStaticAnalysis();
this.registerStyle();
this.registerDoc();
```

## Detailed Documentation

Detailed docs be found at this project's GitHub Pages, thanks to `groc`: [http://thehelp.github.io/project/src/server/grunt_config.html](http://thehelp.github.io/project/src/server/grunt_config.html)

## Some additional notes

### Why this project?

I have a lot of projects. For a while I was using a large collection of shell scripts to give me all the project automation I needed, but that was constly to maintain. Big dependency lists in `package.json`, a lot of file copying to start a new project, and a pain to roll out a new feature to all projects.

When I started playing with grunt, I realized that I could radically improve my approach here, now that we were in code. One unit to pull down, and quite a few things would be in place immediately.

### Goals

The goal of `thehelp-project` is to encompass basic project automation which all node projects might want. Nothing specific to the client side, or servers, or full web applications. Just node: node modules, command-line utilities, etc.

### Roadmap

I've been using this code in some form since September 2013, and in its current form since November 2013. I'm using it in something like 15 projects, so I feel all breaking changes. I plan to follow [semver](http://semver.org/) like this:

* n.n.__X__ (patch): bug fixes, patch and minor version dependency updates
* n.__X__.n (minor version): new features (which may generate new warnings/errors in your project)
* __X__.n.n (major version): API breaking changes, removed features, major version dependency updates

Possible changes on the horizon (as of 2014-06-22):

* Pull tests into documentation, linking back to tests
* Preparing a new release of node module - ensure version entry in History.md, use that text for tag and commit, update package.json version
* Pull a list of contributors, add to readme ([this or something like it](https://github.com/dtrejo/node-authors))
* Audit dependencies - the right style of version: either 0.n.m/0.n.x or n.m.o/n.m.x/n.x
* Add [grunt-jsbeautifier](https://github.com/vkadam/grunt-jsbeautifier), with VERIFY_ONLY
* Experiment with `groc`'s jsdoc-style keyword support (mostly for this project's documentation; no changes to this project should be needed)
* Optimize grunt startup time by only loading tasks we know we'll need (takes 1.1 - 1.2 seconds to start grunt for this project on a Core i7/SSD machine)

### Support

Use [Github Issues](https://github.com/thehelp/project/issues) for feature requests and bugs. Use [StackOverflow](http://stackoverflow.com/search?q=thehelp) for troubleshooting. For discussion about the future of TheHelp, new projects, big new features, [join the mailing list](https://groups.google.com/forum/#!forum/thehelp-discussion).

### Contributions

First, you'll need a file 'env.json' in your root directory with contents like this:

```json
{
  "VAR": "value"
}
```

When you have some changes ready, please submit a pull request with:

* Justification - why is this change worthwhile? Link to issues, use code samples, etc.
* Documentation changes for your code updates. Be sure to check the `groc`-generated HTML too.
* A description of how you tested the change

I may ask you to use a `git rebase` to ensure that your commits are not interleaved with commits already in the history. And of course, make sure `grunt` completes successfully. :0)

### Thanks

Lastly, this project is really just a collection of other open-source projects. Many thanks to everyone before me who has provided such value to the community. I hope to continue that fine tradition.

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
