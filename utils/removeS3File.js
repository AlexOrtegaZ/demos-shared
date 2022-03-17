/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
