const gulp = require("gulp");

const config = require("./config");

require("require-dir")("./tasks");

gulp.task("default", () => {

	console.log(`======== ${config.packageName} ========`);

});