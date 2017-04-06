/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

const express = require('express');

const upload       = require('../controller/upload');
const acquireImage = require('../controller/acquireImage');
const checkCode    = require('../controller/checkCode');
const download     = require('../controller/download');

const multerUtil     = require('../middlewares/multerUtil');
const base64         = require('../middlewares/base64');
const downloadParser = require('../middlewares/download');

const router = module.exports = express.Router();

router.get('/', function (req, res) {
  return res.end();
});

// 上传图片
router.post('/upload/images', multerUtil.uploadFiles, upload.uploadFiles);

router.post('/upload/images/base64', base64.base64Decode, upload.uploadImageBase64);

// 远程下载图片
router.get('/download/images', downloadParser.downloadImages, download.downloadImages);

// 获取图片
router.get('/images/:firstFile/:secondFile/:filename', acquireImage.acquireImage);

// 百度编辑器远程下载
router.post('/ueditor/download/image', downloadParser.ueditorDownloadImage, download.ueditorDownloadImage);

// 下载并替换html详情中的图片
router.post('/replace/content', downloadParser.replaceContent, download.replaceContent);

// 百度编辑器上传图片
router.post('/ueditor/upload/image', multerUtil.uploadFiles, upload.ueditorUploadFiles);

// 获取数字验证码
router.get('/checkcode', checkCode.acquireCheckCode);
