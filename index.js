var es = require('event-stream');
var path = require('path');
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

    if(typeof options.path === 'function') {
      url = path.join(options.path(file.path.replace(__dirname, '')));
    } else {
      url = path.join(file.path.replace(__dirname, ''));
    };

    if (process.platform === 'win32') {
      url = url.replace(/\\/g, '/');
    }

    file.contents = new Buffer(gutil.template(template, {
      url: url,
      contents: htmlJsStr(file.contents),
      file: file
    }));

    callback(null, file);
  });
}

module.exports = function(options) {
  if(typeof options.standalone === 'undefined') {
    options.standalone = true;
  }

  var templateHeader = 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {';
  var templateFooter = '}]);';

  return es.pipeline(
    templateCache(options),
    concat(options.filename),
    header(templateHeader, {
      module: options.module || 'templates',
      standalone: (options.standalone ? ', []' : '')
    }),
    footer(templateFooter)
  );
};