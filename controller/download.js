/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const cheerio        = require('cheerio');
const Download       = require('download');
const downloadStatus = require('download-status');

const image = require('../services/image');

const tmpDir    = config.tmpDir;


module.exports = {
  replaceContent      : replaceContent,
  ueditorDownloadImage: ueditorDownloadImage,
  downloadImages      : downloadImages
};


/**
 * downloadImages
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
function downloadImages(req, res) {
  let urls = req.query.urls;

  try {
    urls = JSON.parse(urls);
  } catch (err) {
    // logger.error('下载图片链接解析出错: ', err);
  }

  if (!Array.isArray(urls)) {
    urls = [urls];
  }

  return downloadResult(urls)
    .then((imageInfos) => res.json({code: 0, msg: imageInfos}))
    .catch((err) => {
      logger.error(err);
      return res.json({code: 1, msg: err});
    });
}

/**
 * 返回图片的全部信息
 * @param {Array} urls
 * @returns {Promise.<TResult>}
 */
function downloadResult(urls) {
  return downFiles(urls)
    .then((files) => image.handleImages(files));
}

/**
 * ueditorDownloadImage
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
function ueditorDownloadImage(req, res) {
  let imgs    = req.body['source[]'] || req.body.source || [];

  if (!Array.isArray(imgs)) {
    imgs = [imgs];
  }

  return downloadResult(imgs)
    .then((imageInfos) => {
      const list = [];
      for (let i = 0, len = imageInfos.length; i < len; i++) {
        list.push({url: `${imageInfos[i].imageUrl}${imageInfos[i].url}`, source: imageInfos[i].originUrl, state: 'SUCCESS'});
      }
      return res.json({state: 'SUCCESS', list: list});
    })
    .catch(() => {
      return res.json({state: 'FAILED', tip: '远程图片抓取失败', list: []});
    });
}

/**
 * replaceContent
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
function replaceContent(req, res) {
  let content = req.body.content || '';

  if (!content) {
    return res.json({code: 0, msg: ''});
  }

  const imgs = parseImgs(content);

  return downloadResult(imgs).then((imageinfos) => {
    imageinfos.map((imageInfo) => {
      const imgUrl =  `${imageInfo.imageUrl}${imageInfo.url}`;
      content      = content.replace(imageInfo.originUrl, imgUrl);
      return null;
    });
    return res.json({code: 0, msg: content});
  });
}

/**
 * 提取html详情中的图片连接
 * @param {String} content
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
 * @param {Array} urls
 * @returns {*}
 */
function downFiles(urls) {
  const imageInfos = [];
  return Promise.each(urls, (url) => {
    url            = decodeURIComponent(url);
    const fileName = utils.myuuid();
    return new Promise((resolve, reject) => {
      const downloader = new Download({extract: true, strip: 1});
      downloader
        .get(url)
        .rename(fileName)
        .dest(tmpDir)
        .use(downloadStatus)
        .run((err) => {
          if (err) {
            return reject(err);
          }
          const fullPath = path.join(tmpDir, fileName);
          imageInfos.push({originUrl: url, name: fileName, path: fullPath});
          return resolve();
        });
    });
  }).return(imageInfos);
}
