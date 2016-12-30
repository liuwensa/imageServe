/**
 * Created by liuwensa on 2016/11/29.
 */

'use strict';

const fs      = require('fs-extra');
const path    = require('path');
const gm      = require('gm');
const request = require('request');
const cheerio = require('cheerio');

const imageUrl  = config.imageUrl;
const uploadDir = config.uploadDir;
const tmpDir    = config.tmpDir;

Promise.promisifyAll(gm.prototype);

module.exports = {
  downloadImage       : downloadImage,
  replaceContent      : replaceContent,
  ueditorDownloadImage: ueditorDownloadImage
};

const reqHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36'
};

/**
 * downloadImage
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
function downloadImage(req, res) {
  const sourceUrl = req.query.url;

  if (!sourceUrl) {
    return res.json({code: 1, msg: '下载的资源链接不能为空！'});
  }

  return downSources(sourceUrl)
    .then((fileUrl) => {
      return res.json({code: 0, msg: {fileUrl: fileUrl}});
    })
    .catch((err) => {
      return res.json({code: 1, msg: err});
    });
}

/**
 * ueditorDownloadImage
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
function ueditorDownloadImage(req, res) {
  let imgs    = req.body['source[]'] || req.body.source || [];
  const paths = [];

  if (!Array.isArray(imgs)) {
    imgs = [imgs];
  }

  return Promise.each(imgs, (img) => {
    return downSources(img)
      .then((fileUrl) => {
        paths.push(fileUrl);
      })
      .catch(() => {
        return null;
      });
  })
    .then(() => {
      const list = [];
      for (let i = 0, len = paths.length; i < len; ++i) {
        list.push({url: imageUrl + paths[i], source: imgs[i], state: 'SUCCESS'});
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

  return Promise.each(imgs, (img) => {
    return downSources(img)
      .then((result) => {
        if (result) {
          const imgUrl = imageUrl + result;
          content      = content.replace(img, imgUrl);
          return null;
        } else {
          return null;
        }
      })
      .catch(() => {
        return null;
      });
  })
    .then(() => res.json({code: 0, msg: content}));
}

/**
 * downSources
 * @param {String} sourceUrl
 * @returns {*}
 */
function downSources(sourceUrl) {
  const filename = utils.myuuid();

  const savePath = path.join(tmpDir, filename);

  const stream = fs.createWriteStream(savePath);

  return new Promise(function (resolve, reject) {
    request.get({
      url    : sourceUrl,
      headers: reqHeaders
    }, function (err) {
      if (err) {
        return reject('下载图片失败！');
      } else {
        return resolve(filename);
      }
    }).pipe(stream);
  })
    .then(() => {
      return new Promise(function (resolve, reject) {
        stream.on('close', () => {
          return resolve();
        });
        stream.on('error', () => {
          return reject('文件下载出错');
        });
      });
    })
    .then(() => {
      return gm(savePath).identifyAsync()
        .then((imgInfo) => {
          const format     = imgInfo.format.toLowerCase();
          const firstFile  = filename.substring(0, 2);
          const secondFile = filename.substring(2, 4);

          const filePath = `/${firstFile}/${secondFile}/${filename}.${format}`;

          const newPath = path.join(uploadDir, filePath);
          /* eslint-disable */
          fs.mkdirsSync(path.dirname(newPath));
          fs.renameSync(savePath, newPath);
          /* eslint-enable */
          return `/images${filePath}`;
        });
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
