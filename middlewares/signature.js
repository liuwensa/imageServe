/**
 * Created by admin on 2018/5/25.
 */

'use strict';

module.exports = {
  checkSign
};

/**
 * 验证签名
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {*}
 */
function checkSign(req, res, next) {
  const signkey    = config.singKey;
  const effectTime = 5 * 60 * 1000;

  let timestamp = +(req.query.timestamp || req.body.timestamp) || 0;
  const sign    = req.query.sign || req.body.sign || '';

  if (!sign || !timestamp) {
    return res.json({code: 1, msg: '参数不正确!'});
  }

  const signtmp = utils.md5(`${signkey}-${timestamp}`);

  if (`${timestamp}`.length === 10) {
    timestamp *= 1000;
  }

  if (Date.now() - timestamp > effectTime) {
    return res.json({code: 1, msg: 'timestamp不正确!'});
  }

  if (sign !== signtmp) {
    return res.json({code: 1, msg: 'sign不正确!'});
  }

  return next();
}
