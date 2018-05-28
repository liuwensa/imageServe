/**
 * Created by liuwensa on 2017/4/5.
 */

'use strict';

const sharp = require('sharp');

Promise.promisifyAll(fs);

const uploadDir = config.uploadDir;
const imageUrl  = config.imageUrl;

module.exports = {
  handleImages
};

/**
 * handleImages
 * @param {Array} files
 * @returns {*}
 */
function handleImages(files) {
  const imageInfos = [];
  return Promise.each(files, (file) => {
    return saveAsFile(file)
      .then((imageInfo) => {
        imageInfos.push(imageInfo);
      });
  })
    .return(imageInfos);
}

/**
 * saveAsFile
 * @param {Object} file
 * @returns {*}
 */
async function saveAsFile(file) {
  const [statInfo, imgInfo] = await Promise.all([
    fs.statAsync(file.path),
    sharp(file.path).metadata()
  ]);

  const filename = file.name;
  const fileSize = statInfo.size;
  const format   = imgInfo.format;
  const width    = imgInfo.width;
  const height   = imgInfo.height;

  const date       = new Date().Format('yyyyMMdd');
  const firstFile  = filename.substring(0, 2);
  const secondFile = filename.substring(2, 4);

  const filePath = `/${date}/${firstFile}/${secondFile}/${filename}-${fileSize}-${width}x${height}.${format}`;

  const newPath = path.join(uploadDir, filePath);

  /* eslint-disable */
  fs.mkdirsSync(path.dirname(newPath));
  fs.renameSync(file.path, newPath);
  /* eslint-enable */

  return {
    imageUrl : imageUrl,
    url      : `${imageUrl}/images${filePath}`,
    shorturl : `/images${filePath}`,
    fileSize : fileSize,
    size     : {width, height},
    format   : format,
    originUrl: file.originUrl || ''
  };
}
