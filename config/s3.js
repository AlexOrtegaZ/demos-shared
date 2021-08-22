const AWS = require('aws-sdk');
const config = require('../../config/config');

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

module.exports = s3;
