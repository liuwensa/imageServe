/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

const express = require('express');

const multerUtil   = require('../controller/multerUtil');
const acquireImage = require('../controller/acquireImage');
const download     = require('../controller/download');

const router = module.exports = express.Router();

router.get('/', function (req, res) {
  return res.end();
});

// 上传图片
router.post('/upload/image', multerUtil.uploadFiles);

// 远程下载图片
router.get('/download/image', download.downloadImage);

// 获取图片
router.get('/images/:firstFile/:secondFile/:filename', acquireImage.acquireImage);

// 百度编辑器远程下载
router.post('/ueditor/download/image', download.ueditorDownloadImage);

// 下载并替换html详情中的图片
router.post('/replace/content', download.replaceContent);

// 百度编辑器上传图片
router.post('/ueditor/upload/image', multerUtil.ueditorUploadFiles);

// 获取数字验证码
router.get('/checkcode', acquireImage.acquireCheckCode);
