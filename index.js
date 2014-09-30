var es = require('event-stream');
var path = require('path');
var _ = require('underscore');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');
var jade = require('jade');
var htmlJsStr = require('js-string-escape');

function templateCache(options) {
  return es.map(function(file, callback) {
    var template = '$templateCache.put("<%= url %>","<%= contents %>");';
    var url;

    file.path = path.normalize(file.path);

    if(typeof options.path === 'function') {
      url = path.join(options.path(file.path, file.base));
    } else {
      url = path.join(file.path);
      url = url.replace(file.base, '');
    };

    if (process.platform === 'win32') {
      url = url.replace(/\\/g, '/');
    }

    var contents = file.contents;

    if(options.engine === 'jade') {
      contents = jade.render(contents);
    }

    contents = htmlJsStr(contents);

    file.contents = new Buffer(gutil.template(template, {
      url: url,
      contents: contents,
      file: file
    }));

    callback(null, file);
  });
}

module.exports = function(options) {
  var defaults = {
    standalone: true,
    module: 'templates',
    filename: 'templates.min.js',
    engine: 'html'
  };

  if(!options) {
    options = {};
  } else if(typeof options === 'string') {
    options = {
      module: options
    };
  }

  if(arguments[1] && typeof arguments[1] === 'string') {
    options.filename = arguments[1];
  }

  options = _.extend(defaults, options);

  var templateHeader = 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {';
  var templateFooter = '}]);';

  return es.pipeline(
    templateCache(options),
    concat(options.filename),
    header(templateHeader, {
      module: options.module,
      standalone: (options.standalone ? ', []' : '')
    }),
    footer(templateFooter)
  );
};