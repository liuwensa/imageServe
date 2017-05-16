/**
 * Created by liuwensa on 2017/4/5.
 */

'use strict';

module.exports = {
  base64Decode,
  base64Encode
};

/**
 * base64图片数据解析
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {*}
 */
function base64Decode(req, res, next) {
  const imgData = req.body.imgdata;

  if (!imgData) {
    return res.json({code: 1, mgs: '参数错误：imgData'});
  }

  // 过滤data:URL
  const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = new Buffer(base64Data, 'base64');

  const fileName = utils.myuuid();
  const fullPath = path.join(config.tmpDir, fileName);


  fs.writeFile(fullPath, dataBuffer, function (err) {
    if (err) {
      logger.error(err);
      return res.json({code: 1, mgs: err});
    } else {
      req.files = [{
        name: fileName,
        path: fullPath
      }];
      return next();
    }
  });
}

/**
 * 转化图片资源为base64
 * @param {String} fileDir
 * @returns {*}
 */
function base64Encode(fileDir) {
  // eslint-disable-next-line
  const bitmap = fs.readFileSync(fileDir);

  return new Buffer(bitmap).toString('base64');
}
