// reference: https://github.com/ocombe/ng2-translate/blob/master/karma-test-shim.js

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma"s synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () { };

SystemJS.config({
	baseURL: "/base/",
	defaultJSExtensions: true,
	paths: {
		"npm:*": "node_modules/*"
	},
	map: {
		"@angular": "npm:@angular",
		"@ssv": "npm:@ssv",
		"rxjs": "npm:rxjs",

		// angular bundles
		"@angular/core": "npm:@angular/core/bundles/core.umd.js",
		"@angular/common": "npm:@angular/common/bundles/common.umd.js",
		"@angular/compiler": "npm:@angular/compiler/bundles/compiler.umd.js",
		"@angular/platform-browser": "npm:@angular/platform-browser/bundles/platform-browser.umd.js",
		"@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
		"@angular/http": "npm:@angular/http/bundles/http.umd.js",
		"@angular/router": "npm:@angular/router/bundles/router.umd.js",
		"@angular/forms": "npm:@angular/forms/bundles/forms.umd.js",

		// angular testing umd bundles
		"@angular/core/testing": "npm:@angular/core/bundles/core-testing.umd.js",
		"@angular/common/testing": "npm:@angular/common/bundles/common-testing.umd.js",
		"@angular/compiler/testing": "npm:@angular/compiler/bundles/compiler-testing.umd.js",
		"@angular/platform-browser/testing": "npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js",
		"@angular/platform-browser-dynamic/testing": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js",
		"@angular/http/testing": "npm:@angular/http/bundles/http-testing.umd.js",
		"@angular/router/testing": "npm:@angular/router/bundles/router-testing.umd.js",
		"@angular/forms/testing": "npm:@angular/forms/bundles/forms-testing.umd.js",
	},
	packages: {
		"jquery": { main: "jquery.min.js", defaultExtension: "js" },
		"jasmine-jquery": { main: "jasmine-jquery.js", defaultExtension: "js" },

		"@ssv/ng2-core": { main: "dist/amd/index.js", defaultExtension: "js" },
	}
});

SystemJS.import("test/test-setup")
	.then(function () {
		return Promise.all(resolveTestFiles());
	})
	.then(function () {
		__karma__.start();
	}, function (error) {
		__karma__.error(error.stack || error);
	});

function onlySpecFiles(path) {
	return /[\.|_]spec\.js$/.test(path);
}
function resolveTestFiles() {
	return Object.keys(window.__karma__.files)  // All files served by Karma.
		.filter(onlySpecFiles)
		.map(function (moduleName) {
			return SystemJS.import(moduleName);
		});
}