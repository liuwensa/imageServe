/**
 * Created by admin on 2017/5/16.
 */

'use strict';

const gm  = require('gm');
const url = require('url');

const uploadDir = config.uploadDir;
const imageUrl  = config.imageUrl;

module.exports = {
  watermarkImage
};

/**
 * watermarkImage
 * @param req
 * @param res
 * @returns {*}
 */
function watermarkImage(req, res) {
  const imgurl = req.body.imgurl;
  const action = req.body.action || 'create';

  if (action === 'cancel') {
    // TODO 直接返回原图
  }

  const filePath    = imgurl.replace(imageUrl, '');
  const urlParse    = url.parse(filePath.true);
  const pathname    = urlParse.pathname;
  const filePathDir = path.join(uploadDir, pathname);

  // 应该数据库存储对应关系
  const destFilePathDir = path.join(uploadDir, 'watermark', pathname);
  const newImageUrl     = `${imageUrl}/watermark${pathname}`;

  // eslint-disable-next-line
  if (!fs.existsSync(filePathDir) || !fs.stateSync(filePathDir).size) {
    return res.json({code: 1, msg: '原图不存在！'});
  }

  // eslint-disable-next-line
  if (fs.existsSync(destFilePathDir) && fs.stateSync(destFilePathDir).size) {
    return res.json({code: 0, msg: {url: newImageUrl}});
  }

  // eslint-disable-next-line
  fs.mkdirsSync(path.dirname(destFilePathDir));

  gm(filePathDir)
    .composite('水印图的目录')
    .gravity('SouthEast')
    .write(destFilePathDir, function (err) {
      if (err) {
        return res.json({code: 1, msg: err});
      } else {
        return res.json({code: 0, msg: {url: newImageUrl}});
      }
    });
}
