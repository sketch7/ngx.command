const gulp = require("gulp");
const tslint = require("gulp-tslint");
const stylish = require("gulp-tslint-stylish");

const config = require("../config");

gulp.task("lint", () => {
	gulp.src(config.src.ts)
		.pipe(tslint())
		.pipe(tslint.report(stylish, {
			emitError: true,
			sort: true,
			bell: false,
			fullPath: true
		}));
});