const removeS3File = require('./removeS3File');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (req.file) {
      removeS3File(req.file.key);
    }
    next(err);
  });
};

module.exports = catchAsync;
