import path from 'path';
import concat from 'gulp-concat';
import { minify, Options as HTMLMinifierOptions } from 'html-minifier';

const es = require('event-stream');
const header = require('gulp-header');
const footer = require('gulp-footer');
const lodashTemplate = require('lodash.template');

export interface NgTemplatesOptions {
    module: string;
    path?: string | ((path: string, base: string) => string);
    filename: string;
    header: string;
    footer: string;
    standalone: boolean;
    htmlMinifier: HTMLMinifierOptions;
}

function templateCache(options: NgTemplatesOptions) {
    return es.map(function(file: any, callback: (err: any, htmlMinifierfile: any) => void) {
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

        let contents = file.contents.toString();

        if(options.htmlMinifier) {
            contents = minify(contents, options.htmlMinifier);
        }

        contents = require('js-string-escape')(contents);

        file.contents = Buffer.from(lodashTemplate(template)({
            url: url,
            contents: contents,
            file: file
        }), 'utf8');

        callback(null, file);
    });
}

module.exports = function(inputOptions?: string | Partial<NgTemplatesOptions>, filename?: string) {
    let options: NgTemplatesOptions = {
        htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            conservativeCollapse: false,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true
        },
        standalone: true,
        module: 'templates',
        filename: 'templates.min.js',
        header: 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function($templateCache) {',
        footer: '}]);'
    };

    if(typeof inputOptions === 'object' && inputOptions !== null) {
        options = {...options, ...inputOptions};
    } else if(typeof inputOptions === 'string') {
        options = {
            ...options,
            module: inputOptions
        };
    }

    if(typeof filename !== 'undefined') {
        options.filename = filename;
    }

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