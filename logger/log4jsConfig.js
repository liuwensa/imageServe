/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

const logConf = config.log;

const logFileDir = logConf.dir;

// eslint-disable-next-line
fs.mkdirsSync(path.join(logFileDir, 'main'));

module.exports = {
  appenders : {
    console  : {
      type: 'console'
    },
    main     : {
      type                : 'dateFile',
      filename            : path.join(logFileDir, 'main/log-'),
      pattern             : 'yyyyMMdd',
      alwaysIncludePattern: true,
      compress            : true,
      maxLogSize          : 1024 * 1024 * 30
    },
    mainerror: {
      type      : 'file',
      filename  : path.join(logFileDir, 'error.log'),
      compress  : true,
      maxLogSize: 1024 * 1024 * 30
    },
    error    : {
      type    : 'logLevelFilter',
      level   : 'ERROR',
      appender: 'mainerror'
    },
    mainwarn : {
      type      : 'file',
      filename  : path.join(logFileDir, 'warn.log'),
      compress  : true,
      maxLogSize: 1024 * 1024 * 30
    },
    warns    : {
      type    : 'logLevelFilter',
      level   : 'warn',
      appender: 'mainwarn'
    }
  },
  categories: {
    default: {
      appenders: ['console', 'main', 'error', 'warns'],
      level    : 'all'
    }
  }
};
