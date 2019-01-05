'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
const del = require('del');
const filepathdel = require('path');
const path = {
	dist: { 
		html: 'dist/',
		style: 'dist/css/',
		js: 'dist/js/',
		img: 'dist/img/',
		fonts: 'dist/fonts/',
		svg: 'src/img/svg/'
	},
	src: {
		html: 'src/*.{html,access}',
		style: 'src/scss/**/*.scss',
		cssLibs: 'src/libs-css/**/*.css',
		js: 'src/js/**/*.js',
		jsLibs: 'src/libs-js/**/*.js',
		img: 'src/img/**/*',
		fonts: 'src/fonts/**/*',
		svg: 'src/img/svg/**/*.svg'
	},
	watch: {
		html: 'src/*.{html,access}',
		style: 'src/scss/**/*.scss',
		cssLibs: 'src/libs-css/**/*.css',
		js: 'src/js/**/*.js',
		jsLibs: 'src/libs-js/**/*.js',
		img: 'src/img/**/*'
	}
};

// Lazy Task
function lazyRequireTask(taskName, path, options) {
	options = options || {};
	options.taskName = taskName;
	gulp.task(taskName, function(callback) {
		let task = require(path).call(this, options);
		return task(callback);
	});
}

// HTML
lazyRequireTask('html', './tasks/html.js', {
	src: path.src.html,
	dist: path.dist.html
});

// SCSS to CSS
lazyRequireTask('style', './tasks/style.js', {
	src: path.src.style,
	dist: path.dist.style
});

// CSSlibs to dist
lazyRequireTask('cssLibs', './tasks/css-libs.js', {
	src: path.src.cssLibs,
	dist: path.dist.style
});

// JS
lazyRequireTask('js', './tasks/script.js', {
	src: path.src.js,
	dist: path.dist.js
});

// JSlibs to dist
lazyRequireTask('jsLibs', './tasks/js-libs.js', {
	src: path.src.jsLibs,
	dist: path.dist.js
});

// Img
lazyRequireTask('img', './tasks/img-min.js', {
	src: path.src.img,
	dist: path.dist.img
});

// Fonts
lazyRequireTask('fonts', './tasks/fonts.js', {
	src: path.src.fonts,
	dist: path.dist.fonts
});

// SVG
lazyRequireTask('svg-sprite', './tasks/svg-sprite.js', {
	src: path.src.svg,
	dist: path.dist.svg
});

// Clear dir
gulp.task('clean', function(done) {
	del.sync('dist');
	done();
});

// Builder
gulp.task('build', gulp.parallel(
	'html',
	'style',
	'cssLibs',
	'js',
	'jsLibs',
	'img',
	'fonts'
));

// Watcher
gulp.task('watch', function() {
	gulp.watch(path.watch.html, gulp.parallel('html')).on('unlink', function(filepath) {
		$.remember.forget('html', filepathdel.resolve(filepath));
		delete $.cached.caches.html[filepathdel.resolve(filepath)];
		let filePathFromSrc = filepathdel.relative(filepathdel.resolve('src'), filepath);
		let destFilePath = filepathdel.resolve('dist', filePathFromSrc);
		del.sync(destFilePath);
	});

	gulp.watch(path.watch.style, gulp.parallel('style')).on('unlink', function(filepath) {
		$.remember.forget('style', filepathdel.resolve(filepath));
		delete $.cached.caches.style[filepathdel.resolve(filepath)];
	});
	
	gulp.watch(path.watch.cssLibs, gulp.parallel('cssLibs')).on('unlink', function(filepath) {
		$.remember.forget('cssLibs', filepathdel.resolve(filepath));
		delete $.cached.caches.cssLibs[filepathdel.resolve(filepath)];
	});

	gulp.watch(path.watch.js, gulp.parallel('js')).on('unlink', function(filepath) {
		$.remember.forget('js', filepathdel.resolve(filepath));
		delete $.cached.caches.js[filepathdel.resolve(filepath)];
	});

	gulp.watch(path.watch.jsLibs, gulp.parallel('jsLibs')).on('unlink', function(filepath) {
		$.remember.forget('jsLibs', filepathdel.resolve(filepath));
		delete $.cached.caches.jsLibs[filepathdel.resolve(filepath)];
	});

	gulp.watch(path.watch.img, gulp.parallel('img')).on('unlink', function(filepath) {
		delete $.cached.caches.img[filepathdel.resolve(filepath)];
		let filePathFromSrc = filepathdel.relative(filepathdel.resolve('src'), filepath);
		let destFilePath = filepathdel.resolve('dist', filePathFromSrc);
		del.sync(destFilePath);
	});
});

// Browser-Sync
gulp.task('browser-sync', function(done) {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		notify: false,
		ghostMode: false
	});
	
	browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
	done();
});

// Start
gulp.task('default', gulp.series('build', gulp.parallel(
	'watch',
	'browser-sync'
)));

// gulp --dev (с sourcemaps)
// gulp (без sourcemaps)