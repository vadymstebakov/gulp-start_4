'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.plumber({
				errorHandler: $.notify.onError(function(err) {
					return {
						title: 'css-libs',
						message: err.message
					};
				})
			}))
			.pipe($.cached('cssLibs'))
			.pipe($.debug({title: 'DEBUG css-libs'}))
			.pipe($.remember('cssLibs'))
			.pipe($.concat('libs.css'))
			.pipe($.cssnano())
			.pipe($.rename({
				suffix: '.min'
			}))
			.pipe(gulp.dest(options.dist));
	};	
};