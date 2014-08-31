gulp-ng-templates
=================

Build all of your angular templates in just one js file using $templateCache provider

## Installation
```
npm install --save-dev gulp-ng-templates
```

## Example

**gulpfile.js**

```js
gulp.task('partials', ['clean'], function () {
	return gulp.src(paths.partials)
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(ngTemplates({
			filename: 'partials.js',
			module: 'App/Partials',
			path: function (path) {
				return path.replace('/src/js/components', '').replace('/partials', '');
			}
		}))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(paths.public + '/js'));
});
```

## API

gulp-ng-templates([options](#options))

----

### options

#### path - {function} (default: not a change)

> Change the path of your partials. (See the example above)

#### standalone - {boolean} (default: true)

> Create a new AngularJS module, instead of using an existing one.
