'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src, {since: gulp.lastRun('fonts')})
			.pipe($.newer(options.dist))
			.pipe(gulp.dest(options.dist));
	};
};