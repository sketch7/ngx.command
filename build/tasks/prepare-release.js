const gulp = require("gulp");
const runSequence = require("run-sequence");
const conventionalChangelog = require("gulp-conventional-changelog");
const bump = require("gulp-bump");
const git = require("gulp-git");
const fs = require("fs");

const args = require("../args");
const config = require("../config");

var publishBranch;
gulp.task("prepare-release", (cb) => {
	args.isRelease = true;
	return runSequence(
		"ci",
		"bump-version",
		//"doc",
		"changelog",
		cb);
});

gulp.task("perform-release", (cb) => {
	return runSequence(
		"commit-changes",
		"push-changes",
		"create-new-tag",
		"npm-publish",
		cb);
});

gulp.task("publish", (cb) => {
	if (args.isRelease) {
		return publish(null, "HEAD", cb);
	}
	return publish("prerelease", "HEAD", cb);
});

// utils
// -------------

gulp.task("bump-version", () => {
	return gulp.src(["./package.json"])
		.pipe(bump({ type: args.bump, preid: args.versionSuffix })) //major|minor|patch|prerelease
		.pipe(gulp.dest("./"));
});

gulp.task("changelog", () => {
	return gulp.src(`${config.doc}/CHANGELOG.md`, {
		buffer: false
	})
		.pipe(conventionalChangelog({
			preset: "angular",
			releaseCount: 0
		}))
		.pipe(gulp.dest(`${config.doc}`));
});

gulp.task("commit-changes", () => {
	const version = getPackageJsonVersion();
	return gulp.src(".")
		.pipe(git.add())
		.pipe(git.commit(`[Prepare Release] Bumped version to ${version}.`));
});

gulp.task("push-changes", (cb) => {
	git.push("origin", publishBranch, cb);
});

gulp.task("create-new-tag", (cb) => {
	var version = getPackageJsonVersion();
	git.tag(version, `Created Tag for version: ${version}`, (error) => {
		if (error) {
			return cb(error);
		}
		git.push("origin", publishBranch, { args: "--tags" }, cb);
	});
});

gulp.task("npm-publish", (cb) => {
	const exec = require("child_process").exec;
	exec("npm publish", (error, stdout, stderr) => {
		if (error) {
			return cb(error);
		}
		console.log(`npm publish - ${stdout}`);
		cb();
	});
});

function getPackageJsonVersion() {
	// We parse the json file instead of using require because require caches
	// multiple calls so the version number won't be updated
	return JSON.parse(fs.readFileSync("./package.json", "utf8")).version;
}

function publish(bump, branch, cb) {
	if (bump) {
		args.bump = bump;
	}
	publishBranch = branch;
	return runSequence(
		"prepare-release",
		"perform-release",
		cb);
}
