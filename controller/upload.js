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
 * 上传form说明：
 *```html
 * <form action="http://127.0.0.1:20008/upload/images" method="POST" enctype="multipart/form-data">
 *   <h3 class="title">上传测试</h3>
 *   <table>
 *     <tr>
 *       <td><input type="file" name="upfile"/></td>
 *       <td><input type="file" name="upfile"/></td>
 *       <td><input type="file" name="upfile"/></td>
 *       <td><input type="submit"  value="上传"/></td>
 *      </tr>
 *    </table>
 *</form>
 *```
 * @method 图片上传接口 /upload/images - POST
 * @returns {Promise.<TResult>} 返回结果：
 * ```json
 * {
 * "code": 200,
 *    "msg": [
 *        {
 *            "imageUrl": "http://127.0.0.1:20008",
 *            "url": "/images/ef/33/ef33b5203a47493d93afed6263ef1ea0-10225-320x240.jpeg",
 *            "fileSize": 10225,
 *            "size": {
 *                "width": 320,
 *                "height": 240
 *            },
 *            "format": "JPEG",
 *            "originUrl": ""
 *        },
 *        {
 *            "imageUrl": "http://127.0.0.1:20008",
 *            "url": "/images/52/91/5291b12c26834f718cdae26028aff435-28054-384x240.jpeg",
 *            "fileSize": 28054,
 *            "size": {
 *                "width": 384,
 *                "height": 240
 *            },
 *            "format": "JPEG",
 *            "originUrl": ""
 *        }
 *    ]
 *}
 * ```
 * */
function uploadFiles(req, res) {
  return image.handleImages(req.files)
    .then((imageInfos) => {
      return res.json({code: 200, msg: imageInfos});
    });
}

/**
 * 上传参考普通上传接口
 * @method 百度编辑器上传图片 /ueditor/upload/image -POST
 * @returns {Promise.<TResult>} 返回结果：
 * ```json
 * {
 *    "url": "http://127.0.0.1:20008/images/9e/19/9e19c826b71e47a5a6b415e52fccda97-10225-320x240.jpeg",
 *    "title": "",
 *    "original": "",
 *    "state": "SUCCESS"
 *}
 * ```
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
 * @method base64上传 /upload/images/base64 -POST
 * @param {String} req.body.imgdata  图片的base64码
 * @returns {Promise} 返回结果：
 * ```json
 * {
 *  "code": 0,
 *  "mgs": [
 *    {
 *      "imageUrl": "http://127.0.0.1:20008",
 *      "url": "/images/5f/ac/5fac34899c1742a191d5e43d8ccaa6e9-123111-183x180.gif",
 *      "fileSize": 123111,
 *      "size": {
 *        "width": 183,
 *        "height": 180
 *      },
 *      "format": "GIF",
 *      "originUrl": ""
 *    }
 *  ]
 *}
 * ```
 */
function uploadImageBase64(req, res) {
  return image.handleImages(req.files).then((imageInfos) => {
    return res.json({code: 0, mgs: imageInfos});
  });
}
