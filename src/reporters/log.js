const gutil = require('gulp-util');
const map   = require('map-stream');

/**
 * Log reporter
 *
 * @returns {Stream} Object stream usable in Gulp pipes.
 */
export default function () {
  return map((files, cb) => {
    files.forEach(file => {
      const report = file.phpcsReport || {};

      if (!report.error) {
        return;
      }

      gutil.log(report.output.replace(/\n/g, '\n  ').trim());
    });

    cb(null, files);
  });
}
