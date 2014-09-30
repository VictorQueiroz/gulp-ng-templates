gulp-ng-templates
=================

Build all of your angular templates in just one js file using $templateCache provider

## Installation
```
npm install --save-dev gulp-ng-templates
```

## Example 1

```js
var gulp = require('gulp');
var ngTemplates = require('gulp-ng-templates');

gulp.task('partials', ['clean'], function () {
	return gulp.src(paths.partials)
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(ngTemplates({
			filename: 'partials.js',
			module: 'App/Partials',
			path: function (path, base) {
				return path.replace(base, '').replace('/partials', '');
			}
		}))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('public/js'));
});
```

## Example 2

```js
var gulp = require('gulp');
var ngTemplates = require('gulp-ng-templates');

gulp.task('partials', ['clean'], function () {
	return gulp.src(paths.partials)
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(ngTemplates('moduleName'))
		// .pipe(ngTemplates('moduleName', 'fileName.js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('public/js'));
});
```

## API

gulp-ng-templates ([options](#options))

----

### options

#### path - {function} [path=file.path, file.base]

> Change the path of your partials. (See the example above)

> If you not set this option it will automatically replace all of the file base path with nothing.

#### standalone - {boolean} (default: true)

> Create a new AngularJS module, instead of using an existing one.

#### module - {string}

> Provides the module name, by default we use 'templates'

#### engine - {string}

> Build the templates which are in a specific engine

- html
- jade