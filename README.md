# thehelp-project

This project is designed to get a high quality grunt-based project automation setup in place very quickly.

## Features

Grunt task setup:

* time-grunt
* env (using env.json)
* mocha-cli for 'unit', 'integration' and 'interactive' tasks, running everything underneath 'test/<test type>' excluding the 'client' subdirectory
* command-line options supported for tests: 'grep', 'coverage', 'reporter' and 'bail'
* staticanalysis, encompassing two tasks: jshint and complexity
* doc, wrapping two tasks: groc and fix-groc-stylesheet
* watch core setup and subtasks for tests, static analysis and documentation generation
* `modifiedInLast()` method to filter files processed using the grunt 'partial' command-line option
# clean, deleting public/*, tmp/* by default, and extended to include files under doc if you call `registerDoc()`

## Jump in!

### Install

Include the project in your dependencies:

```
  "thehelp-project": "git+ssh://git@infra:thehelp-project#v1.0.0"
```

### Usage

To get up and running very quickly with all defaults, just put this in your Gruntfile:

```
var GruntConfig = require('thehelp-project').GruntConfig;
var config = new GruntConfig(grunt);
config.standardSetup();
config.standardDefault();
```

## History

### 1.0.0

* Initial release
* time-grunt, env, testing with mocha-cli, jshint, complexity, groc and fix-groc-stylesheet, clean, watch, filter, code coverage support in testing,


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
