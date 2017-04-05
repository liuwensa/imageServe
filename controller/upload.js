/**
 * Created by liuwensa on 2017/4/5.
 */

'use strict';

const image = require('../services/image');

module.exports = {
  uploadFiles       : uploadFiles,
  ueditorUploadFiles: ueditorUploadFiles,
  uploadImageBase64 : uploadImageBase64
};

/**
 * uploadFiles
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise.<TResult>}
 */
function uploadFiles(req, res) {
  return image.handleImages(req.files).then((imageInfos) => {
    return res.json({code: 0, mgs: imageInfos});
  });
}

/**
 * 百度编辑器上传图片
 * @param {object} req
 * @param {object} res
 * @returns {Promise.<TResult>}
 */
function ueditorUploadFiles(req, res) {
  return image.handleImages(req.files).then((imageInfos) => {
    const imageInfo = imageInfos[0];
    return res.json({url: imageInfo.imageUrl + imageInfo.url, title: '', original: '', state: 'SUCCESS'});
  })
    .catch((err) => {
      logger.error('百度编辑器上传图片出错：', err);
      return res.json({url: '', title: '', original: '', state: 'FAILED'});
    });
}

/**
 * uploadImageBase64
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
function uploadImageBase64(req, res) {
  return image.handleImages(req.files).then((imageInfos) => {
    return res.json({code: 0, mgs: imageInfos});
  });
}
