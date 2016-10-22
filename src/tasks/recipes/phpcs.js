import PHPCodeSnifferTask from '../PHPCodeSnifferTask';

/**
 * PHP CodeSniffer Task
 *
 * @param {string|Array|null} src     Glob or array of globs
 * @param {object|null}       options PHP CodeSniffer options
 * @returns {void}
 */
function task(src, options = {}) {
  // eslint-disable-next-line no-new
  new PHPCodeSnifferTask('phpcs', getPaths(src), options);
}

/**
 * Prep the Gulp src paths.
 *
 * @param {string|Array|null} src Glob or array of globs
 * @returns {GulpPaths} Gulp src paths
 */
function getPaths(src) {
  const config = Elixir.config;

  return new Elixir.GulpPaths()
    .src(src || [
      `${config.appPath}/**/*.php`,
      `${config.testing.phpUnit.path}${config.testing.phpUnit.search}`,
      `${config.testing.phpSpec.path}${config.testing.phpSpec.search}`,
    ]);
}

Elixir.extend('phpcs', task);
