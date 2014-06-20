# thehelp-project

This project is designed to get high quality grunt-based project automation in place very quickly, with just one entry in your package.json.

## Features

* [`time-grunt`](https://github.com/sindresorhus/time-grunt), tracking how long your grunt tasks take
* [`env`](https://github.com/jsoverson/grunt-env), loading environment variables from env.json
* [`mocha-cli`](https://github.com/Rowno/grunt-mocha-cli) for 'unit', 'integration' and 'manual' tasks, running [`mocha`](http://visionmedia.github.io/mocha/) tests underneath 'test/<test type>' excluding the 'client' subdirectory
* command-line options supported for tests: 'grep', 'coverage', 'reporter' and 'bail'
* static analysis, using two tasks: [`jshint`](http://www.jshint.com/) and [`complexity`](https://github.com/philbooth/complexity-report)
* style checking, using the highly-configurable [`jscs`](https://github.com/mdevils/node-jscs)
* documentation generation via [`groc`](https://github.com/nevir/groc) (with a few stylesheet tweaks)
* [`watch`](https://github.com/gruntjs/grunt-contrib-watch) core setup and subtasks for tests, static analysis, style and documentation generation
* grunt 'partial' command-line option to cut down watch task run times (via `modifiedInLast()`)
* [`clean`](https://github.com/gruntjs/grunt-contrib-clean), deleting everything under 'public/', 'tmp/', and 'dist/' by default, and extended to include files under 'doc/' along with documentation generation setup

## Setup

First, install the project as a dev dependency:

```
npm install thehelp-project --save-dev
```

Then make sure you have the grunt installed locally and the `grunt` command available:

```
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

Now, again using all the defaults, you'll have to structure your project in the way `thehelp-project` expects:

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

### Code coverage

To use code coverage functionality, you'll need to have [`blanket`](https://github.com/alex-seville/blanket) installed as a dev dependency at the top level in your project:

```
npm install blanket --save-dev
```

In your package.json you'll need some configuration information to let `blanket` know which files you want to instrument for code coverage. I usually use something like this:

```
"config": {
  "blanket": {
    "data-cover-only": "src",
    "data-cover-never": "['lib/','node_modules/','test/','src/client']"
  }
}
```

### Documentation generation

To use `groc`-based documentation generation, you'll need to have [Pygments](http://pygments.org/docs/installation/) installed. On OSX, the easiest way to install it is:

```
sudo easy_install Pygments
```

Even on non-OSX, `easy_install` is still the the right way to install it. You'll just need to pull down [Python](http://www.python.org/getit/) to get it.


## Usage

### Testing

Put some `mocha` tests in place, then try these commands:

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

`groc` generates html files from markdown in your source files' comments.

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
grunt watch:unit

# note: when filtering, you'll need to modify the test files
grunt watch:unit --partial 3
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

## Some additional notes

This project uses my fork of `groc` for a few reasons. Without my changes:

* Full file paths from original machine are generated into behavior.js
* `jade` dependency is locked to pre-1.x
* Package is not protected against future breaking changes due to '>=' dependency versions

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
