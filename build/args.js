const yargs = require("yargs");

const config = require("./config");

var argv = yargs
	.alias("rel", "release")
	.default("rel", false)

	.choices("bump", ["major", "minor", "patch", "prerelease"])
	.default("bump", "patch")

	.default("versionSuffix", "rc")
	.default("reporters", config.test.reporters)
	.default("browsers", config.test.browsers)

	.argv;

module.exports = {
	bump: argv.bump,
	versionSuffix: argv.versionSuffix,
	isRelease: argv.rel,
	reporters: argv.reporters,
	browsers: [].concat(argv.browsers)
};