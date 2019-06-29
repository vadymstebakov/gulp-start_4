'use strict';

const gulp = require('gulp');
const argv = require('yargs').argv;
const combine = require('stream-combiner2').obj;
const $ = require('gulp-load-plugins')();

module.exports = function(options) {
	return function() {
		return gulp.src(options.src)
			// .pipe($.wait(100))
			.pipe($.plumber({
				errorHandler: $.notify.onError(function(err) {
					return {
						title: 'scss',
						message: err.message
					};
				})
			}))
			.pipe($.cached('style'))
			.pipe($.sassInheritance({dir: 'src/scss/'}))
			.pipe($.filter(function (file) {
				return !/\/_/.test(file.path) || !/^_/.test(file.relative);
			}))
			.pipe($.if(argv.dev, $.sourcemaps.init()))
			.pipe($.sass({outputStyle: 'expanded'}))
			.pipe($.autoprefixer())
			.pipe($.debug({title: 'DEBUG style'}))
			.pipe($.remember('style'))
			.pipe($.if(!argv.dev, combine($.cssnano(), $.rename({suffix: '.min'}))))
			.pipe($.if(argv.dev, $.sourcemaps.write()))
			.pipe(gulp.dest(options.dist));
	};	
};