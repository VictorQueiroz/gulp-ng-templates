import assert from 'assert';
import File from 'vinyl';
import ngTemplates from '../src';
import path from 'path';
import { test } from 'sarg';

test('should build html templates', () => {
	const contents = `<div class="row">
		<div class="large-12 columns"></div>
	</div>`;

	const file = new File({
		path: path.join(__dirname, 'template-1.html'),
		base: path.join(__dirname),
		contents: Buffer.from(contents, 'utf8')
	});

	const stream = ngTemplates('moduleName', 'templates.js');

	return new Promise((resolve, reject) => {
		stream.on('data', function (file: any) {
			const result = 'angular.module("moduleName", []).run(["$templateCache", ' +
							'function($templateCache) {$templateCache.put("/template-1.html",' +
							'"<div class=\\"row\\"><div class=\\"large-12 columns\\"></div></div>");}]);';

			assert(!file.isStream());
			assert.equal(file.contents.toString(), result);
			assert.equal(file.path.replace(file.base + '/', ''), 'templates.js');
			resolve();
		});
		stream.write(file);
		stream.end();
	});
});
