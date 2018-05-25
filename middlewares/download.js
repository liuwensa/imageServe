/**
 * Created by admin on 2017/4/6.
 */

'use strict';

const cheerio        = require('cheerio');
const Download       = require('download');

const tmpDir = config.tmpDir;


module.exports = {
  replaceContent,
  ueditorDownloadImage,
  downloadImages
};


/**
 * downloadImages
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 * @returns {*}
 */
function downloadImages(req, res, next) {
  let urls = req.query.urls || req.body.urls;

  try {
    urls = JSON.parse(urls);
  } catch (err) {
    // logger.error('下载图片链接解析出错: ', err);
  }

  if (!Array.isArray(urls)) {
    urls = [urls];
  }

  return downloadResult(urls, req, res, next);
}

/**
 * ueditorDownloadImage
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 * @returns {*}
 */
function ueditorDownloadImage(req, res, next) {
  // let urls = req.body['source[]'] || req.body.source || [];
  //
  // if (!Array.isArray(urls)) {
  //   urls = [urls];
  // }
  const urls = req.body.urls;

  if (!Array.isArray(urls)) {
    return res.json({state: 'FAILED', tip: '传入的参数不是数组', list: []});
  }

  if (urls.length === 0) {
    return res.json({state: 'SUCCESS', list: []});
  }

  return downloadResult(urls, req, res, next);
}

/**
 * replaceContent
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 * @returns {*}
 */
function replaceContent(req, res, next) {
  const content = req.body.content || '';

  if (!content) {
    return res.json({code: 0, msg: ''});
  }

  const urls = parseImgs(content);

  return downloadResult(urls, req, res, next);
}

/**
 * 提取html详情中的图片连接
 * @param content
 * @returns {Array}
 */
function parseImgs(content) {
  const ret = cheerio.load(content, {
    normalizeWhitespace: false,
    xmlMode            : false,
    decodeEntities     : false
  });

  const imgs = [];
  ret('img').each((index, e) => {
    imgs.push(ret(e).attr('src'));
  });

  return imgs;
}

/**
 * 下载图片到临时目录
 * @param urls
 */
async function downFiles(urls) {
  const imageInfos = [];

  for (const url of urls) {
    const filename = utils.myuuid();
    await Download(url, tmpDir, {filename});

    const fullPath = path.join(tmpDir, filename);
    imageInfos.push({originUrl: url, name: filename, path: fullPath});
  }

  return imageInfos;
}

/**
 * downloadResult
 * @param {Array|String} urls
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise.<T>}
 */
function downloadResult(urls, req, res, next) {
  return downFiles(urls)
    .then((files) => {
      if (files && files.length > 0) {
        req.files = files;
        return next();
      } else {
        return res.json({code: 1, msg: '下载失败！'});
      }
    })
    .catch((err) => {
      logger.error(err);
      return res.json({code: 1, msg: err});
    });
}
