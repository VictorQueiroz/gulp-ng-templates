var es = require('event-stream');
var path = require('path');
var _ = require('lodash');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var htmlJsStr = require('js-string-escape');

function templateCache(options) {
  return es.map(function(file, callback) {
    var template = '$templateCache.put("<%= url %>","<%= contents %>");';
    var url;

    file.path = path.normalize(file.path);

    if(_.isFunction(options.path)) {
      url = path.join(options.path(file.path, file.base));
    } else {
      url = path.join(file.path);
      url = url.replace(file.base, '');
    };

    if (process.platform === 'win32') {
      url = url.replace(/\\/g, '/');
    }

    var contents = file.contents;

    /**
     * HTML to JavaScript
     */
    contents = htmlJsStr(contents);

    file.contents = new Buffer(gutil.template(template, {
      url: url,
      contents: contents,
      file: file
    }));

    callback(null, file);
  });
}

module.exports = function(options, filename) {
  var defaults = {
    standalone: true,
    module: 'templates',
    filename: 'templates.min.js',
    header: 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
    footer: '}]);'
  };

  if(_.isUndefined(options)) {
    options = {};
  } else if(_.isString(options)) {
    options = {
      module: options
    };
  }

  if(!_.isUndefined(filename)) {
    options.filename = filename;
  }

  options = _.extend({}, defaults, options);
  
  return es.pipeline(
    templateCache(options),
    concat(options.filename),
    header(options.header, {
      module: options.module,
      standalone: (options.standalone ? ', []' : '')
    }),
    footer(options.footer)
  );
};