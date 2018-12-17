# gulp-ng-templates

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X7BZW864PRHSU)

Build all of your angular templates in just one js file using `$templateCache` provider

## Installation
```
npm install --save-dev gulp-ng-templates
```
```
yarn add -D gulp-ng-templates
```

## Example 1

```js
var gulp = require('gulp');
var ngTemplates = require('gulp-ng-templates');

gulp.task('templates', ['clean'], function () {
	return gulp.src(paths.templates)
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(ngTemplates({
			filename: 'templates.js',
			module: 'App/templates',
			path: function (path, base) {
				return path.replace(base, '').replace('/templates', '');
			}
		}))
		.pipe(gulp.dest('public/js'));
});
```

## Example 2

```js
var gulp = require('gulp');
var ngTemplates = require('gulp-ng-templates');

gulp.task('templates', ['clean'], function () {
	return gulp.src(paths.templates)
		.pipe(ngTemplates('moduleName'))
		.pipe(gulp.dest('public/js'));
});
```

## API

gulp-ng-templates ([options](#options))

----

### options

#### `path` - {function} [path=file.path, file.base]

> Change the path of your templates. (See the example above)

> If you not set this option it will automatically replace all of the file base path with nothing.

#### `standalone` - {boolean} (default: true)

> Create a new AngularJS module, instead of using an existing one.

#### `htmlMinifier` - {object|boolean}

> Options to pass to the [html-minifier](https://github.com/kangax/html-minifier) module

##### Defaults
```js
{
	removeComments: true,
	collapseWhitespace: true,
	preserveLineBreaks: false,
	conservativeCollapse: false,
	collapseBooleanAttributes: true,
	collapseInlineTagWhitespace: true
}
```

#### `module` - {string} (default: templates)

> Provides the module name.

#### `header` - {string}

> The template header, the default value is:

```js
angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {
```

#### `footer` - {string}

> The template footer, the default value is:

```js
}]);
```