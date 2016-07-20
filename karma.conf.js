const conf = require("./build/config");

module.exports = function (config) {
	config.set({
		basePath: "./",
		frameworks: ["systemjs", "jasmine"],

		systemjs: {
			config: {
				paths: {
					"*": "*",
					"src/*": "src/*",
					"typescript": "node_modules/typescript/lib/typescript.js",
					"systemjs": "node_modules/systemjs/dist/system.js",
					"system-polyfills": "node_modules/systemjs/dist/system-polyfills.js",
					"es6-module-loader": "node_modules/es6-module-loader/dist/es6-module-loader.js",
					"n:*": "node_modules/*"
				},
				map: {
					"@angular": "n:@angular",
					"rxjs": "n:rxjs"
				},
				packages: {
					"src": {
						defaultExtension: "ts"
					},
					"rxjs": {
						defaultExtension: "js"
					},
					"@angular/core": {
						main: "index.js",
						defaultExtension: "js"
					}
				},
				transpiler: "typescript"
			},
			serveFiles: [
				conf.src.ts,
				"node_modules/**/*.js"
			]
		},
		files: [
			// Polyfills.
			"node_modules/es6-shim/es6-shim.js",
			"node_modules/reflect-metadata/Reflect.js",

			// Zone.js dependencies
			"node_modules/zone.js/dist/zone.js",
			"node_modules/zone.js/dist/jasmine-patch.js",
			"node_modules/zone.js/dist/async-test.js",
			"node_modules/zone.js/dist/fake-async-test.js",

			conf.src.testTs,
			"src/*.spec.ts"
		],
		exclude: [],
		preprocessors: {},
		reporters: ["mocha"], // note: gulp using config from config.js instead
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ["Chrome"], // note: gulp using config from config.js instead
		singleRun: false
	});
};