/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const image = require('../services/image');

module.exports = {
  replaceContent,
  ueditorDownloadImage,
  downloadImages
};


/**
 * @method 下载图片 /download/images - GET
 * @param {String} req.query.urls  下载图片数组，JSON.stringify()后数组字符串
 * @returns {*} 返回结果：
 * ```json
 * {
 *    "code": 0,
 *    "msg": [
 *        {
 *            "imageUrl": "http://127.0.0.1:20008",
 *            "url": "/images/40/34/4034807e7e6042e8bb83d6faf512d174-56776-600x400.jpeg",
 *            "fileSize": 56776,
 *            "size": {
 *                "width": 600,
 *                "height": 400
 *            },
 *            "format": "JPEG",
 *            "originUrl": "http://img.357.com/wjgame/up/lo/upload_507e2d290ddbae3328d1cb02e7f2005d.jpg_450x450.jpg"
 *        },
 *        {
 *            "imageUrl": "http://127.0.0.1:20008",
 *            "url": "/images/10/15/1015eadd83a5430f9679ee14f30964da-61660-600x400.jpeg",
 *            "fileSize": 61660,
 *            "size": {
 *                "width": 600,
 *                "height": 400
 *            },
 *            "format": "JPEG",
 *            "originUrl": "http://img.357.com/wjgame/up/lo/upload_2f59a8f4f17d3b6a59fb6efb4d59ec39.jpg_450x450.jpg"
 *        }
 *    ]
 *}
 * ```
 */
function downloadImages(req, res) {
  return image.handleImages(req.files)
    .then((imageInfos) => res.json({code: 0, msg: imageInfos}))
    .catch((err) => {
      logger.error(err);
      return res.json({code: 1, msg: err});
    });
}

/**
 * @method 百度编辑器远程抓取图片 /ueditor/download/image - POST
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
function ueditorDownloadImage(req, res) {
  return image.handleImages(req.files)
    .then((imageInfos) => {
      const list = [];
      for (let i = 0, len = imageInfos.length; i < len; i++) {
        list.push({
          url   : `${imageInfos[i].imageUrl}${imageInfos[i].url}`,
          source: imageInfos[i].originUrl,
          state : 'SUCCESS'
        });
      }
      return res.json({state: 'SUCCESS', list: list});
    })
    .catch(() => {
      return res.json({state: 'FAILED', tip: '远程图片抓取失败', list: []});
    });
}

/**
 * @method  下载并替换html中图片 /replace/content - POST
 * @param {String} req.body.content html详细信息
 * @returns {*}
 */
function replaceContent(req, res) {
  let content = req.body.content;

  return image.handleImages(req.files)
    .then((imageinfos) => {
      imageinfos.map((imageInfo) => {
        const imgUrl = `${imageInfo.imageUrl}${imageInfo.url}`;
        content      = content.replace(imageInfo.originUrl, imgUrl);
        return null;
      });
      return res.json({code: 0, msg: content});
    });
}
