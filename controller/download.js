/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const image = require('../services/image');

module.exports = {
  replaceContent      : replaceContent,
  ueditorDownloadImage: ueditorDownloadImage,
  downloadImages      : downloadImages
};


/**
 * @method 下载图片 /download/images - GET
 * @param {String} req.query.urls  下载图片数组，JSON.stringify()后数组字符串
 * @returns {*}
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
        list.push({url: `${imageInfos[i].imageUrl}${imageInfos[i].url}`, source: imageInfos[i].originUrl, state: 'SUCCESS'});
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
