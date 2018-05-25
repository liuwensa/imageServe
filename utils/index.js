/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const uuid   = require('node-uuid');
const lodash = require('lodash');
const md5    = require('md5');

module.exports = {
  uuid: uuid,
  _   : lodash,

  myuuid: function () {
    return uuid().replace(/-/g, '');
  },
  md5   : function (content) {
    return md5(content);
  }
};
