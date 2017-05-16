/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

global.ROOT_PATH = __dirname;

global.Promise = require('bluebird');
global.path    = require('path');
global.fs      = require('fs-extra');

global.config = require('config');


global.utils  = require('./utils');
global.logger = require('./logger');
