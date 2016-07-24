const conf = require("./build/config");

module.exports = function (config) {
	config.set({
		basePath: "./",
		frameworks: ["jasmine"],

		files: [
			"node_modules/es6-shim/es6-shim.js",
			"node_modules/zone.js/dist/zone.js",
			"node_modules/zone.js/dist/async-test.js",
			"node_modules/zone.js/dist/fake-async-test.js",
			"node_modules/zone.js/dist/long-stack-trace-zone.js",
			"node_modules/zone.js/dist/jasmine-patch.js",
			"node_modules/systemjs/dist/system.src.js",
			"node_modules/reflect-metadata/Reflect.js",

			"src/**/*.html",

			"node_modules/jquery/dist/jquery.min.js",
			"node_modules/jasmine-jquery/lib/jasmine-jquery.js",

			{ pattern: "node_modules/reflect-metadata/**/*.js.map", included: false, watched: false, served: true },
			{ pattern: "node_modules/systemjs/dist/system-polyfills.js", included: false, watched: false, served: true }, // PhantomJS2 (and possibly others) might require it
			{ pattern: "node_modules/@angular/**/*.js", included: false, watched: false, served: true },
			{ pattern: "node_modules/@angular/**/*.js.map", included: false, watched: false, served: true },
			{ pattern: "node_modules/rxjs/**/*.js", included: false, watched: false, served: true },
			{ pattern: "node_modules/rxjs/**/*.js.map", included: false, watched: false, served: true },
			{ pattern: "node_modules/@ssv/*/dist/**/*.js", included: false, watched: false, served: true },
			{ pattern: "node_modules/@ssv/*/dist/**/*.js.map", included: false, watched: false, served: true },

			{ pattern: conf.src.ts, included: false, watched: true }, // source files
			"karma-test-shim.js"
		],
		exclude: [
			"node_modules/**/*_spec.js",
			"node_modules/**/*.spec.js",
		],
		preprocessors: {
			// "src/**/*.html": ["ng-html2js"],
			[conf.src.ts]: ["typescript"],
		},
		typescriptPreprocessor: {
			options: {
				inlineSourceMap: true,
				inlineSources: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true
			}
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