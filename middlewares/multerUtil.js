/**
 * FileName:multerUtil.js
 * Author:liuwensa
 * Date:2016/11/29
 * Describe: 图片上传
 */

'use strict';

const multer = require('multer');


const storage = multer.diskStorage({
  /**
   * 设置上传后文件路径
   * 文档上说：
   *      You are responsible for creating the directory when providing destination as a function.
   *      When passing a string, multer will make sure that the directory is created for you.
   * 但是貌似并不能自动创建
   * @param {object} req
   * @param {object} file
   * @param {function} cb
   */
  destination: function (req, file, cb) {
    cb(null, config.tmpDir);
  },

  /**
   * 给上传文件命名处理，获取添加后缀名
   * @param {object} req
   * @param {object} file
   * @param {function} cb
   */
  filename: function (req, file, cb) {
    file.name = utils.myuuid();
    cb(null, file.name);
  }
});

// const upload = multer({storage: storage}).single('file');

const uploadImages = multer({storage: storage}).array('file');

exports.uploadFiles = uploadFiles;

/**
 * uploadFiles
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
function uploadFiles(req, res, next) {
  uploadImages(req, res, function (err) {
    if (err) {
      logger.error(err);
      return res.json({code: 1, mgs: err});
    } else if (!req.files || req.files.length === 0) {
      return res.json({code: 1, mgs: '上传图片不能为空！'});
    } else {
      return next();
    }
  });
}
