const gutil = require('gulp-util');
const map   = require('map-stream');

module.exports = function () {
  return map((files, cb) => {
    files.forEach((file) => {
      const report = file.phpcsReport || {};

      if (!report.error) {
        return;
      }

      gutil.log(report.output.replace(/\n/g, '\n  ').trim());
    });

    cb(null, files);
  });
};
