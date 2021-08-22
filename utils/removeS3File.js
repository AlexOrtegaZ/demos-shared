const s3 = require('../config/s3');
const config = require('../../config/config');
const logger = require('../config/logger');

const removeS3File = (imageKey) => {
  s3.deleteObject(
    {
      Bucket: config.aws.bucket,
      Key: imageKey,
    },
    function (err) {
      if (err) {
        logger.error(`Can not delete: ${imageKey}`);
        logger.error(`${err}`);
      }
    }
  );
};

module.exports = removeS3File;
