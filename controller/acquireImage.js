/**
 * Created by liuwensa on 2017/4/6.
 */

'use strict';

const gm = require('gm');

Promise.promisifyAll(gm.prototype);

const uploadDir = config.uploadDir;
const picSizes  = config.picSizes;

const imgReg  = /(?:[_.](\d{2,6})x(\d{2,6})(?:Q(\d{1,3}))?(S|SM|ST|SB|SL|SR)?\.(?:jpg|jpeg|png|webp|gif))$/;
const cropReg = /_crop_((_?\d{1,4}(?:\.\d)?){4})\.(?:jpg|jpeg|png|webp|gif)$/;

module.exports = {
  acquireImage
};

/**
 * 图片访问接口 /images/:date/:firstFile/:secondFile/:filename - GET
 * @param {String} req.params.date         - 日期 20180528
 * @param {String} req.params.firstFile    - 一级路径
 * @param {String} req.params.secondFile   - 二级路径
 * @param {String} req.params.filename     - 文件名称
 * @returns {Promise.<T>}
 */
function acquireImage(req, res) {
  const date       = req.params.date;
  const firstFile  = req.params.firstFile;
  const secondFile = req.params.secondFile;
  const filename   = req.params.filename;

  const filePathName = path.join(uploadDir, date, firstFile, secondFile, filename);

  const thumbnailPath = filePathName.replace('images', 'thumbnails');

  let fileOriginUrl;

  // 裁剪图片
  const cropRegMatch = filePathName.match(cropReg);

  if (cropRegMatch) {
    // eslint-disable-next-line
    if (fs.existsSync(thumbnailPath)) {
      return sendFile(thumbnailPath);
    }

    fileOriginUrl = filePathName.replace(cropRegMatch[0], '');

    // eslint-disable-next-line
    if (fs.existsSync(fileOriginUrl)) {
      const xywh = cropRegMatch[1].split('_');

      const cropX = xywh[0];
      const cropY = xywh[1];
      const cropW = xywh[2];
      const cropH = xywh[3];

      // eslint-disable-next-line
      fs.mkdirsSync(path.dirname(thumbnailPath));

      return gm(fileOriginUrl)
        .crop(cropW, cropH, cropX, cropY)
        .writeAsync(thumbnailPath)
        .then(() => sendFile(thumbnailPath))
        .catch(function (err) {
          logger.error(err);
          return sendFile(fileOriginUrl);
        });
    } else {
      logger.error('原图不存在!');
      res.status(404);
      return res.end();
    }
  }

  // 缩略图
  const strMatch = filePathName.match(imgReg);

  if (!strMatch) {
    // eslint-disable-next-line
    if (fs.existsSync(filePathName)) {
      return sendFile(filePathName);
    } else {
      logger.error('原图不存在!');
      res.status(404);
      return res.end();
    }
  }

  // 缩略图存在直接返回
  // eslint-disable-next-line
  if (fs.existsSync(thumbnailPath)) {
    return sendFile(thumbnailPath);
  }

  const x = strMatch[1];
  const y = strMatch[2];
  const q = strMatch[3] || 100;
  const s = strMatch[4];

  if (picSizes && !picSizes.includes(`${x}x${y}`)) {
    res.status(404);
    return res.end();
  }

  fileOriginUrl = filePathName.replace(strMatch[0], '');

  // eslint-disable-next-line
  if (fs.existsSync(fileOriginUrl)) {
    return imageSizeAsync()
      .then(function (image) {
        const width  = image.width;
        const height = image.height;
        let w        = width;
        let h        = height;

        if (width >= height && height > x) {
          w = parseInt(x * width / height);
          h = x;
        } else if (width < height && width > x) {
          w = x;
          h = parseInt(x * height / width);
        } else {
          // 原图尺寸小于缩略图尺寸，返回原图。
          return sendFile(fileOriginUrl);
        }

        // eslint-disable-next-line
        fs.mkdirsSync(path.dirname(thumbnailPath));

        const onlyThumbnailPath = s ? thumbnailPath.replace(s, '') : thumbnailPath;

        function thumbAsync() {
          // eslint-disable-next-line
          if (fs.existsSync(onlyThumbnailPath)) {
            return Promise.resolve();
          } else {
            return gm(fileOriginUrl)
              .thumbAsync(w, h, onlyThumbnailPath, q);
          }
        }

        return thumbAsync()
          .then(function () {
            if (width !== height && s) {
              const min = x >= y ? y : x;

              let posLTx = 0;
              let posLTy = 0;
              if (width > height) {
                switch (s) {
                  case 'SM':
                    posLTx = (w - min) / 2;
                    break;
                  case 'SL':
                    posLTx = 0;
                    break;
                  case 'SR':
                    posLTx = w - min;
                    break;
                  default:
                    posLTx = (w - min) / 2;
                    posLTy = (h - min) / 2;
                    break;
                }
              } else {
                switch (s) {
                  case 'SM':
                    posLTy = (h - min) / 2;
                    break;
                  case 'ST':
                    posLTy = 0;
                    break;
                  case 'SB':
                    posLTy = h - min;
                    break;
                  default:
                    posLTx = (w - min) / 2;
                    posLTy = (h - min) / 2;
                    break;
                }
              }

              logger.info('crop:', s, min, min, posLTx, posLTy, onlyThumbnailPath);

              return gm(onlyThumbnailPath)
                .crop(min, min, posLTx, posLTy)
                .writeAsync(thumbnailPath)
                .then(() => sendFile(thumbnailPath))
                .catch(function (err) {
                  logger.error(err);
                  return sendFile(fileOriginUrl);
                });
            }
            return sendFile(onlyThumbnailPath);
          });
      })
      .catch(function (err) {
        logger.error(err);
        return sendFile(fileOriginUrl);
      });
  } else {
    logger.error('原图不存在:', fileOriginUrl);
    res.status(404);
    return res.end();
  }

  function sendFile(file) {
    res.header('Cache-Control', 'public, max-age=3153600');
    return res.sendFile(file);
  }

  function imageSizeAsync() {
    const matchImgInfo = /[a-z0-9]{32}-(\d{1,10})-(\d{1,5})x(\d{1,5}).*$/.exec(filename);
    if (!matchImgInfo) {
      return gm(fileOriginUrl).sizeAsync();
    }
    return Promise.resolve({
      size  : +matchImgInfo[1],
      width : +matchImgInfo[2],
      height: +matchImgInfo[3]
    });
  }
}
