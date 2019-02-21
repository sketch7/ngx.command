const gulp = require("gulp");
const ssvTools = require("@ssv/tools");

require("./lint");


gulp.task("prebuild:rel", () => ssvTools.prepareReleaseBuild({
	shouldSkip: !process.env.CI
}));