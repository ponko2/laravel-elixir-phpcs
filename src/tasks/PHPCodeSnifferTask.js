/* eslint-disable global-require */

let gutil, phpcs, logReporter, failReporter;

export default class PHPCodeSnifferTask extends Elixir.Task {
  /**
   * Create a new PHP CodeSnifferTask instance.
   *
   * @param {string}      name    Task name
   * @param {GulpPaths}   paths   Gulp src and output paths
   * @param {object|null} options PHP CodeSniffer options
   */
  constructor(name, paths, options) {
    super(name, null, paths);

    this.output  = undefined;
    this.options = options || {};
  }

  /**
   * Lazy load the task dependencies.
   *
   * @returns {void}
   */
  loadDependencies() {
    gutil        = require('gulp-util');
    phpcs        = require('gulp-phpcs');
    logReporter  = require('../reporters/log');
    failReporter = require('../reporters/fail');
  }

  /**
   * Build up the Gulp task.
   *
   * @returns {void}
   */
  gulpTask() {
    return gulp.src(this.src.path)
      .pipe((() => {
        this.recordStep(`Executing ${this.ucName()}`);
        return this.lint();
      })())
      .pipe(gutil.buffer())
      .pipe(logReporter())
      .pipe(failReporter())
      .on('error', this.onError());
  }

  /**
   * Register file watchers.
   *
   * @returns {void}
   */
  registerWatchers() {
    this.watch(this.src.path);
  }

  /**
   * Lint task
   *
   * @returns {Stream} Object stream usable in Gulp pipes.
   */
  lint() {
    return phpcs(this.options);
  }
}
