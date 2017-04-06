/**
 * Created by liuwensa on 2017/4/6.
 */

'use strict';

const uploadDir = config.uploadDir;
const picSizes  = config.picSizes;

const imgReg  = /(?:[_.](\d{2,6})x(\d{2,6})(?:Q(\d{1,3}))?(S|SM|ST|SB|SL|SR)?\.(?:jpg|jpeg|png|webp|gif))$/;
const cropReg = /_crop_((_?\d{1,4}(?:\.\d)?){4})\.(?:jpg|jpeg|png|webp|gif)$/;

module.exports = {
  acquireImage: acquireImage
};

/**
 * 生成的图片后缀可以是：.jpg .jpeg .png .webp
 *
 * 图片路径格式：
 *
 * 约定：原图的路径中不使用下划线 \_ ，使用 - 分隔不同信息。
 * 附加信息使用 \_ 分割，如 _120x120Q100 ，或者是query参数（还未支持），如?w=120&h=120&q=100。
 *
 * 缩略图：
 * /images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg_96x96.jpg
 * /images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg_120x120.jpg
 * /images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg_120x120Q0.jpg
 * /images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg_120x120Q100.jpg
 *
 * 按尺寸和质量缩放
 *
 * /images/a1/04/a104fcfd7dc738dbed6f4a175612e508-879394-1024x768.jpg_120x120.jpg     质量不变，调低尺寸
 * /images/a1/04/a104fcfd7dc738dbed6f4a175612e508-879394-1024x768.jpg_120x120Q100.jpg 质量不变，调低尺寸
 * /images/a1/04/a104fcfd7dc738dbed6f4a175612e508-879394-1024x768.jpg_1024x768Q60.jpg 尺寸不变，调低质量
 *
 * 按尺寸和质量缩放并裁剪：
 *
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100SM.jpg 居中截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100ST.jpg 居上截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100SB.jpg 居下截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100SL.jpg 居左截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100SR.jpg 居右截取
 *
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100Q100SM.jpg 居中截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100Q100ST.jpg 居上截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100Q100SB.jpg 居下截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100Q100SL.jpg 居左截取
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_120x100Q100SR.jpg 居右截取
 *
 * 居中截取 尺寸不变，质量降低:
 * /images/ce/de/cede6d6595afc1f1a45189e2dd04ed60-879394-1024x768.jpg_1024x768Q60SM.jpg
 *
 * 如果原图是水平方向，如全景图，在URL上使用ST、SB将不会起作用，那么截取的图片是 居中截取 的
 * 如果原图是垂直方向，如  长图，在URL上使用SL、SR将不会起作用，那么截取的图片是 居中截取 的
 *
 * 如果文件路径中包含大小和尺寸信息，后缀添加方式无变化。
 *
 * 由于旧的文件路径中不包含大小和尺寸信息，客户端又需要使用大小和尺寸信息，需要对旧的路径进行兼容。
 *
 * 图片质量：Q[0-100] 表示图片质量
 * 图片尺寸: 图片尺寸无限制，超过原图尺寸则安装原图尺寸缩放。
 *
 *
 * gif格式图片处理  NOTE：前端需要对后缀进行判断，服务端需保证图片后缀名无误。
 * 原图：/images/43/fe/43fe0a9a841deb9ff84b2b666fc28d5d.gif
 * 首帧：/images/43/fe/43fe0a9a841deb9ff84b2b666fc28d5d.gif[0].jpg
 *
 * 图片裁剪：
 *
 * 原图：/images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg
 * 切图：/images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg_crop_x_y_w_h.jpg
 * 切图：/images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg_crop_200_200_1000_1000.jpg
 * 切图：/images/a1/04/a104fcfd7dc738dbed6f4a175612e508.jpg_crop_200.1_200.1_1000.4_1000.5.jpg
 *
 * @method 图片访问接口 /images/:firstFile/:secondFile/:filename - GET
 * @param {String} req.params.firstFile    - 一级路径
 * @param {String} req.params.secondFile   - 二级路径
 * @param {String} req.params.filename     - 文件名称
 * @returns {*}
 */
function acquireImage(req, res) {
  const firstFile  = req.params.firstFile;
  const secondFile = req.params.secondFile;
  const filename   = req.params.filename;

  const filePathName = path.join(uploadDir, firstFile, secondFile, filename);

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
