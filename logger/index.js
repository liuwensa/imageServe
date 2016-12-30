/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

const log4js = require('log4js');

const log4jsConfig = require('./log4jsConfig');

log4js.configure(log4jsConfig);

const mainLogger = log4js.getLogger('main');

mainLogger.setLevel('AUTO');

mainLogger.log4js = log4js;

module.exports = mainLogger;
