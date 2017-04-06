/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

const packages = require('../package.json');

const filePath = 'E:\\raid\\imageServe';

module.exports = {
  name        : packages.name,
  version     : packages.version,
  port        : 20008,
  imageUrl    : 'http://127.0.0.1:20008',
  filePath    : filePath,
  tmpDir      : path.join(filePath, 'tmp'),
  uploadDir   : path.join(filePath, 'images'),
  thumbnailDir: path.join(filePath, 'thumbnails'),
  log         : {
    dir   : path.join(filePath, 'logs'),
    // eslint-disable-next-line
    nolog : '/\.(js|css|png|jpg|jpeg|icon|gif|svg)$/',
    format: ':remote-addr :method :url :status :response-time ms',
    level : 'AUTO'
  },
  picSizes    : [
    '60x60',
    '120x120',
    '240x240',
    '480x480'
  ]
};
