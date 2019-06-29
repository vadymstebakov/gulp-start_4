'use strict';

const gulp = require('gulp');
const argv = require('yargs').argv;
const combine = require('stream-combiner2').obj;
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			.pipe($.plumber({
				errorHandler: $.notify.onError(function(err) {
					return {
						title: 'js',
						message: err.message
					};
				})
			}))
			.pipe($.cached('js'))
			.pipe($.if(argv.dev, $.sourcemaps.init()))
			.pipe($.babel({
				presets: ['@babel/env'],
				retainLines: true
			}))
			.pipe($.debug({title: 'DEBUG js'}))
			.pipe($.remember('js'))
			.pipe($.if(!argv.dev, combine($.concat('script.min.js'), $.uglifyjs())))
			.pipe($.if(argv.dev, $.sourcemaps.write()))
			.pipe(gulp.dest(options.dist));
	};	
};