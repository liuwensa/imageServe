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
    const fileName   = utils.myuuid();
    const firstFile  = fileName.substring(0, 2);
    const secondFile = fileName.substring(2, 4);
    const originName = file.originalname;
    const fileFormat = originName.split('.');
    const filePath   = config.uploadDir;
    file.filename    = fileName + '.' + fileFormat[fileFormat.length - 1];
    const fileDir    = path.join(filePath, firstFile, secondFile);

    file.fileUrl = `/images/${firstFile}/${secondFile}/${file.filename}`;
    // eslint-disable-next-line
    fs.mkdirsSync(fileDir);
    cb(null, fileDir);
  },

  /**
   * 给上传文件命名处理，获取添加后缀名
   * @param {object} req
   * @param {object} file
   * @param {function} cb
   */
  filename: function (req, file, cb) {
    cb(null, file.filename);
  }
});

const upload = multer({storage: storage}).single('file');

exports.uploadFiles        = uploadFiles;
exports.ueditorUploadFiles = ueditorUploadFiles;

/**
 * 上传文件
 * @param {object} req
 * @param {object} res
 */
function uploadFiles(req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.json({code: 1, mgs: err});
    } else {
      return res.json({code: 0, mgs: req.file});
    }
  });
}

/**
 * 百度编辑器上传图片
 * @param {object} req
 * @param {object} res
 */
function ueditorUploadFiles(req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.json({url: '', title: '', original: '', state: 'FAILED'});
    } else {
      return res.json({url: config.imageUrl + req.file.fileUrl, title: '', original: '', state: 'SUCCESS'});
    }
  });
}
