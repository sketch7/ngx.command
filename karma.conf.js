const conf = require("./build/config");

module.exports = function (config) {
	config.set({
		basePath: "./",
		frameworks: ["jasmine"],

		files: [
			"node_modules/systemjs/dist/system.src.js",

			"node_modules/core-js/client/shim.js",

			"node_modules/reflect-metadata/Reflect.js",
			"node_modules/zone.js/dist/zone.js",
			"node_modules/zone.js/dist/long-stack-trace-zone.js",
			"node_modules/zone.js/dist/proxy.js",
			"node_modules/zone.js/dist/sync-test.js",
			"node_modules/zone.js/dist/jasmine-patch.js",
			"node_modules/zone.js/dist/async-test.js",
			"node_modules/zone.js/dist/fake-async-test.js",

			{ pattern: "node_modules/reflect-metadata/**/*.js.map", included: false, watched: false, served: true },
			{ pattern: "node_modules/systemjs/dist/system-polyfills.js", included: false, watched: false, served: true }, // PhantomJS2 (and possibly others) might require it
			{ pattern: "node_modules/@angular/**/*.js", included: false, watched: false, served: true },
			{ pattern: "node_modules/@angular/**/*.js.map", included: false, watched: false, served: true },
			{ pattern: "node_modules/rxjs/**/*.js", included: false, watched: false, served: true },
			{ pattern: "node_modules/rxjs/**/*.js.map", included: false, watched: false, served: true },
			{ pattern: "node_modules/@ssv/*/dist/**/*.js", included: false, watched: false, served: true },
			{ pattern: "node_modules/@ssv/*/dist/**/*.js.map", included: false, watched: false, served: true },

			{ pattern: conf.src.ts, included: false, watched: true }, // source files
			{ pattern: conf.test.setup, included: false, watched: true },
			"src/**/*.html",

			"karma-test-shim.js",

			"node_modules/jquery/dist/jquery.min.js",
			"node_modules/jasmine-jquery/lib/jasmine-jquery.js",
		],
		exclude: [
			"node_modules/**/*_spec.js",
			"node_modules/**/*.spec.js",
		],
		preprocessors: {
			// "src/**/*.html": ["ng-html2js"],
			[conf.src.ts]: ["typescript"],
			[conf.test.setup]: ["typescript"],
		},
		typescriptPreprocessor: {
			options: {
				inlineSourceMap: true,
				inlineSources: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true
			}
		},
		client: {
			captureConsole: false // disables console logs
		},
		reporters: ["mocha"], // note: gulp using config from config.js instead
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ["Chrome"], // note: gulp using config from config.js instead
		singleRun: false
	});
};