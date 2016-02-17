'use strict';

var gulp        = require('gulp');
var Elixir      = require('laravel-elixir');
var phpcs       = require('gulp-phpcs');
var gutil       = require('gulp-util');
var map         = require('map-stream');
var events      = require('events');
var emitter     = new events.EventEmitter();
var PluginError = gutil.PluginError;
var notify      = new Elixir.Notification();
var config      = Elixir.config;

var logReporter = function () {
  return map(function (files, cb) {
    files.forEach(function (file) {
      var report  = file.phpcsReport || {};

      if (!report.error) {
        return;
      }

      gutil.log(report.output.replace(/\n/g, '\n  ').trim());
    });

    cb(null, files);
  });
};

var failReporter = function () {
  return map(function (files, cb) {
    var fails   = [];
    var message = '';

    var errors = files.filter(function (file) {
      return file.phpcsReport.error;
    });

    if (errors.length > 0) {
      fails = errors.map(function (file) {
        return file.path;
      });

      message = fails.join(', ');

      emitter.emit('error', new PluginError('phpcs', message));
    }

    cb(null, files);
  });
};

Elixir.extend('phpcs', function (src, options) {
  var paths = new Elixir.GulpPaths()
    .src(src || [config.appPath + '/**/*.php']);

  var onError = function (err) {
    notify.error(err, 'PHP_CodeSniffer Failed');
    this.emit('end');
  };

  new Elixir.Task('phpcs', function () {
    this.log(paths.src);

    return gulp.src(paths.src.path)
      .pipe(phpcs(options || {}))
      .pipe(gutil.buffer())
      .pipe(logReporter())
      .pipe(failReporter())
      .on('error', onError);
  }).watch(paths.src.path);
});
