const gutil       = require('gulp-util');
const map         = require('map-stream');
const events      = require('events');
const pluralize   = require('pluralize');
const emitter     = new events.EventEmitter();
const PluginError = gutil.PluginError;

module.exports = function () {
  return map((files, cb) => {
    const errors = files.filter(file => file.phpcsReport.error);

    if (errors.length > 0) {
      const errorMessage = `Failed with ${errors.length} ${pluralize('error', errors.length)}`;
      emitter.emit('error', new PluginError('phpcs', errorMessage));
    }

    cb(null, files);
  });
};
