'use strict';

var gulp        = require('gulp');
var elixir      = require('laravel-elixir');
var notify      = require('gulp-notify');
var phpcs       = require('gulp-phpcs');
var gutil       = require('gulp-util');
var map         = require('map-stream');
var events      = require('events');
var _           = require('underscore');
var path        = require('path');
var colors      = gutil.colors;
var emitter     = new events.EventEmitter();
var PluginError = gutil.PluginError;

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

      console.log(message);
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

elixir.extend('phpcs', function (src, options) {
  src = src || 'app/**/*.php';

  options = options || {};

  var onError = function (err) {
    notify.onError({
      title: 'Laravel Elixir',
      subtitle: 'PHP_CodeSniffer failed.',
      message: '<%= error.message %>',
      icon: path.join(__dirname, '../laravel-elixir/icons/fail.png')
    })(err);

    this.emit('end');
  };

  gulp.task('phpcs', function () {
    return gulp.src(src)
      .pipe(phpcs(options))
      .pipe(gutil.buffer())
      .pipe(logReporter())
      .pipe(failReporter())
      .on('error', onError)
      .pipe(notify({
        title: 'Laravel Elixir',
        subtitle: 'PHP_CodeSniffer passed.',
        message: ' ',
        icon: path.join(__dirname, '../laravel-elixir/icons/pass.png')
      }));
  });

  this.registerWatcher('phpcs', src);

  return this.queueTask('phpcs');
});
