/**
 * Created by admin on 2016/11/15.
 */

'use strict';

const Promise = require('bluebird');
const cheerio = require('cheerio');
const request = require('request');
const qs      = require('querystring');

module.exports = {
  getPageUtf8: Promise.promisify(getPageUtf8),
  requestGet : Promise.promisify(requestGet)
};

const reqHeaders1 = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36'
};

const reqHeaders = {
  'Host'                     : 'api.bilibili.com',
  'Connection'               : 'keep-alive',
  'Accept-Encoding'          : 'gzip, deflate, sdch',
  'Accept-Language'          : 'zh-CN,zh;q=0.8',
  'Cache-Control'            : 'max-age=0',
  'Accept'                   : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'X-Requested-With'         : 'XMLHttpRequest',
  'User-Agent'               : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36',
  'Content-Type'             : 'application/x-www-form-urlencoded; charset=UTF-8',
  'Upgrade-Insecure-Requests': 1,
  'Cookie'                   : 'pgv_pvi=4987550720; fts=1479116315; buvid3=C6122D62-FCF4-49ED-9B67-BEEBED1E24EA19752infoc; LIVE_BUVID=07addc29fcf9c2405d76a8614c127602; LIVE_BUVID__ckMd5=f830c99123f90e42; _ga=GA1.2.3933462.1479177991; PLHistory=t9VH%7CoWNNq; DedeID=6949685; DedeUserID=57859911; DedeUserID__ckMd5=fedcce8de824e378; SESSDATA=2277ae66%2C1479783932%2C9d2e71e5; ck_pv=jgcUD9; SSID=Qs6zhCVTcUOSQa46LFj7iM6VrIzgSCJlehRx9imNXX_aZnDmUnn_buYbaima0rKJ6IywS_azLb1q8Dklo3QmchfAyvQlpNGgm2UTW_aDDSXgGrY_c; _ver=1; sid=iiuzl445; pgv_si=s4686676992; purl_token=bilibili_1479438715; _cnt_dyn=null; _cnt_pm=0; _cnt_notify=0; uTZ=-480; CNZZDATA2724999=cnzz_eid%3D701291114-1479116314-%26ntime%3D1479440284'
};

function getPageUtf8(url, callback) {
  return request.get({
    url    : url,
    timeout: 6000,
    headers: reqHeaders1,
    gzip   : true
  }, function (err, res, body) {
    if (err) {
      return callback(err);
    }
    let ret = cheerio.load(body, {
      normalizeWhitespace: false,
      xmlMode            : false,
      decodeEntities     : false
    });
    return callback(null, ret);
  });
}

function requestGet(url, options, callback) {
  url += qs.stringify(options);
  // console.log('pipe to: ', url);
  return request.get({
    url    : url,
    timeout: 6000,
    headers: reqHeaders,
    json   : true,
    gzip   : true
  }, function (err, res, body) {
    if (err) {
      return callback(err);
    }
    return callback(null, body);
  });
}
