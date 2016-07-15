const gutil       = require('gulp-util');
const map         = require('map-stream');
const events      = require('events');
const emitter     = new events.EventEmitter();
const PluginError = gutil.PluginError;

module.exports = function () {
  return map((files, cb) => {
    let fails   = [];
    let message = '';

    const errors = files.filter(file => file.phpcsReport.error);

    if (errors.length > 0) {
      fails   = errors.map(file => file.path);
      message = fails.join(', ');

      emitter.emit('error', new PluginError('phpcs', message));
    }

    cb(null, files);
  });
};
