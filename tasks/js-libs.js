'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.plumber({
				errorHandler: $.notify.onError(function(err) {
					return {
						title: 'js-libs',
						message: err.message
					};
				})
			}))
			.pipe($.cached('jsLibs'))
			.pipe($.debug({title: 'DEBUG js-libs'}))
			.pipe($.remember('jsLibs'))
			.pipe($.concat('libs.min.js'))
			.pipe($.uglifyjs())
			.pipe(gulp.dest(options.dist));
	};	
};