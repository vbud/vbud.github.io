'use strict';

var gulp = require('gulp');
var $ = {
	util: require('gulp-util'),
	webpack: require('webpack-stream')
};

var browserSync = require('browser-sync');

var config = require('./config');
var paths = config.paths;


gulp.task('scripts', function () {
	scripts();
});

gulp.task('scripts:watch', function (callback) {
	return scripts(callback);
});

function scripts(callback) {
	var watch = (typeof callback === 'function');

	var webpackOptions = {
		watch: watch,
		module: {
			preLoaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader'
			}],
			loaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}]
		},
		output: {filename: 'index.js'}
	};

	if (watch) {
		webpackOptions.devtool = 'inline-source-map';
	}

	var webpackChangeHandler = function (err, stats) {
		if (err) {
			config.errorHandler('Webpack')(err);
		}
		$.util.log(stats.toString({
			colors: $.util.colors.supportsColor,
			chunks: false,
			hash: false,
			version: true
		}));
		browserSync.reload();
		if (watch) {
			watch = false;
			callback();
		}
	};

	return gulp.src(paths.src + '/index.js')
		.pipe($.webpack(webpackOptions, null, webpackChangeHandler))
		.pipe(gulp.dest(paths.tmpServe + '/'));
}

module.exports = scripts;
