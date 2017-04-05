/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

const logConfig = config.log;

// eslint-disable-next-line
fs.mkdirsSync(path.join(logConfig.dir, 'main'));

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
      filename            : path.join(logConfig.dir, '/main/log'),
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
        filename  : path.join(logConfig.dir, 'main.WARN'),
        maxLogSize: 1024 * 1024 * 30
      }
    },
    {
      category: 'main',
      type    : 'logLevelFilter',
      level   : 'ERROR',
      appender: {
        type      : 'file',
        filename  : path.join(logConfig.dir, 'main.ERROR'),
        maxLogSize: 1024 * 1024 * 30
      }
    }
  ]
};
