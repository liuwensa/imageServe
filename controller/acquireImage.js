/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const fs        = require('fs-extra');
const path      = require('path');
const gm        = require('gm');
const imageSize = require('image-size');

const thumbnailDir = config.thumbnailDir;
const uploadDir    = config.uploadDir;
const picSizes     = config.picSizes;

const imgReg  = /(?:(\d{2,4})x(\d{2,4})\.(?:jpg|png|gif|ico|bmp))$/;
const formats = ['png', 'gif', 'bmp', 'webp'];

Promise.promisifyAll(gm.prototype);

module.exports = {
  acquireImage: acquireImage
};

/**
 * acquireImage
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
function acquireImage(req, res) {
  const firstFile  = req.params.firstFile;
  const secondFile = req.params.secondFile;
  const filename   = req.params.filename;
  const format     = req.query.format || '';

  let filePathName = path.join(uploadDir, firstFile, secondFile, filename);

  const strMatch = filename.match(imgReg);

  if (!strMatch) {
    // eslint-disable-next-line
    if (fs.existsSync(filePathName) && fs.statSync(filePathName).size) {
      return sendFile(filePathName);
    } else {
      logger.error('原图不存在！');
      res.status(404);
      return res.end();
    }
  }

  const x    = strMatch[1];
  const y    = strMatch[2];
  const side = x + 'x' + y;

  let thumbnailPath = filePathName.replace('images', 'thumbnails');

  if (!utils.validator.isIn(side, picSizes)) {
    logger.error('对应的图片无该尺寸：', side);
    res.status(404);
    return res.end();
  }

  let postfix = '_' + side + '.jpg';

  if (format && utils.validator.isIn(format, formats)) {
    postfix       = '_' + side + '.' + format;
    thumbnailPath = thumbnailPath.replace('_' + side + '.jpg', postfix);
    filePathName  = filePathName.replace('_' + side + '.jpg', postfix);
  }

  // eslint-disable-next-line
  if (fs.existsSync(thumbnailPath) && fs.statSync(thumbnailPath).size) {
    return sendFile(thumbnailPath);
  }

  let originUrl       = '';
  const fileOriginUrl = filePathName.replace(postfix, '');

  // eslint-disable-next-line
  if (fs.existsSync(fileOriginUrl) && fs.statSync(fileOriginUrl).size) {
    originUrl = fileOriginUrl;
  } else {
    logger.error('原图不存在!');
    res.status(404);
    return res.end();
  }

  return imageSizeAsync()
    .then(() => gm(originUrl).sizeAsync())
    .then((image) => {
      const wOri = image.width;
      const hOri = image.height;
      let w      = wOri;
      let h      = hOri;
      if (wOri >= hOri && hOri > x) {
        w = parseInt(x * wOri / hOri);
        h = x;
      } else if (wOri < hOri && wOri > x) {
        w = x;
        h = parseInt(x * hOri / wOri);
      }
      // eslint-disable-next-line
      fs.mkdirsSync(path.join(thumbnailDir, firstFile, secondFile));
      return gm(originUrl).thumbAsync(w, h, thumbnailPath, 80)
        .then(() => sendFile(thumbnailPath));
    })
    .catch((err) => {
      logger.error(err);
      res.status(404);
      return res.end();
    });

  /**
   * sendFile
   * @param {string} file
   * @returns {*}
   */
  function sendFile(file) {
    res.header('Cache-Control', 'public, max-age=3153600');
    return res.sendFile(file);
  }

  /**
   * imageSizeAsync
   * @returns {*}
   */
  function imageSizeAsync() {
    return new Promise((resolve) => {
      imageSize(originUrl, function (err, dimensions) {
        if (err) {
          return resolve(dimensions);
        } else if (dimensions && dimensions.type === 'jpg') {
          if (utils.validator.isIn(format, formats)) {
            filePathName = filePathName.replace(postfix, '_' + side + '.jpg');

            // eslint-disable-next-line
            if (fs.existsSync(filePathName)) {
              return sendFile(filePathName);
            }
          }
        }
        return resolve(dimensions);
      });
    });
  }
}
