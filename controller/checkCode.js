/**
 * Created by liuwensa on 2017/4/6.
 */

'use strict';

const Captchapng = require('captchapng');

module.exports = {
  acquireCheckCode
};

/**
 * @method 获取数字验证码 /checkcode - GET
 * @param {Number} [req.query.width]  验证码宽，默认100
 * @param {Number} [req.query.height]  验证码高，默认30
 */
function acquireCheckCode(req, res) {
  const width  = +req.query.width || 100;
  const height = +req.query.height || 30;

  const code = parseInt((Math.random() * 9000) + 1000);

  // 记录验证码，用于后续验证
  // req.session.checkcode = code;

  const p = new Captchapng(width, height, code);
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);

  const img       = p.getBase64();
  const imgbase64 = new Buffer(img, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png'
  });
  res.end(imgbase64);
}
