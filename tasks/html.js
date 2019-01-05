'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.cached('html'))
			.pipe($.newer(options.dist))
			.pipe($.debug({title: 'DEBUG html'}))
			.pipe($.remember('html'))
			.pipe(gulp.dest(options.dist));
	};
};