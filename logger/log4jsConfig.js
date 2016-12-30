/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

const path = require('path');
const fs   = require('fs-extra');

// eslint-disable-next-line
fs.mkdirsSync(path.join(config.log.dir, 'main'));

module.exports = {
  level         : 'AUTO',
  replaceConsole: true,
  appenders     : [
    {
      type: 'console'
    },
    {
      category            : 'main',
      type                : 'dateFile',
      filename            : path.join(config.log.dir, '/main/log'),
      pattern             : 'yyyyMMdd',
      alwaysIncludePattern: true,
      maxLogSize          : 1024 * 1024 * 30
    },
    {
      category: 'main',
      type    : 'logLevelFilter',
      level   : 'WARN',
      appender: {
        type      : 'file',
        filename  : path.join(config.log.dir, 'main.WARN'),
        maxLogSize: 1024 * 1024 * 30
      }
    },
    {
      category: 'main',
      type    : 'logLevelFilter',
      level   : 'ERROR',
      appender: {
        type      : 'file',
        filename  : path.join(config.log.dir, 'main.ERROR'),
        maxLogSize: 1024 * 1024 * 30
      }
    }
  ]
};
