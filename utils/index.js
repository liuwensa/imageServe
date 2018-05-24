/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const uuid      = require('node-uuid');
const lodash    = require('lodash');
const cryptos   = require('crypto');

module.exports = {
  uuid     : uuid,
  _        : lodash,

  myuuid: function () {
    return uuid().replace(/-/g, '');
  },
  md5   : function (content) {
    const buf = new Buffer(content);
    content   = buf.toString('binary');
    const md5 = cryptos.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
  }
};
