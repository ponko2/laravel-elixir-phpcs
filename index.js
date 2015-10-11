'use strict';

var gulp        = require('gulp');
var Elixir      = require('laravel-elixir');
var phpcs       = require('gulp-phpcs');
var gutil       = require('gulp-util');
var map         = require('map-stream');
var events      = require('events');
var _           = require('underscore');
var colors      = gutil.colors;
var emitter     = new events.EventEmitter();
var PluginError = gutil.PluginError;
var notify      = new Elixir.Notification;
var config      = Elixir.config;

var logReporter = function () {
  return map(function (files, cb) {
    _.each(files, function (file) {
      var report = file.phpcsReport || {};

      if (!report.error) {
        return;
      }

      var message = colors.underline(file.path) + '\n  ' +
        colors.red(report.error) + '\n    ' +
        report.output.replace(/\n/g, '\n    ');

      gutil.log(message);
    });

    cb(null, files);
  });
};

var failReporter = function () {
  return map(function (files, cb) {
    var errors = _.filter(files, function (file) {
      return file.phpcsReport.error;
    });

    if (errors.length > 0) {
      var fails = _.map(errors, function (file) {
        return file.path;
      });

      var message = 'PHP_CodeSniffer failed for: ' + fails.join(', ');

      emitter.emit('error', new PluginError('phpcs', message));
    }

    cb(null, files);
  });
};

Elixir.extend('phpcs', function (src, options) {
  var paths = new Elixir.GulpPaths()
    .src(src || [config.appPath + '/**/*.php']);

  var onError = function (err) {
    notify.error(err, 'PHP_CodeSniffer failed');
    this.emit('end');
  };

  new Elixir.Task('phpcs', function () {
    this.log(paths.src);

    return gulp.src(paths.src.path)
      .pipe(phpcs(options || {}))
      .pipe(gutil.buffer())
      .pipe(logReporter())
      .pipe(failReporter())
      .on('error', onError)
      .pipe(notify.message('PHP_CodeSniffer passed'));
  }).watch(paths.src.path);
});
