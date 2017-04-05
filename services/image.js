/**
 * Created by liuwensa on 2017/4/5.
 */

'use strict';

const uploadDir = config.uploadDir;
const imageUrl  = config.imageUrl;

module.exports = {
  saveAsFile  : saveAsFile,
  handleImages: handleImages
};

/**
 * handleImages
 * @param {Array} files
 * @returns {*}
 */
function handleImages(files) {
  const imageInfos = [];
  return Promise.each(files, (file) => {
    return saveAsFile(file).then((imageInfo) => {
      imageInfos.push(imageInfo);
    });
  }).return(imageInfos);
}

/**
 * saveAsFile
 * @param {Object} file
 * @returns {*}
 */
function saveAsFile(file) {
  return Promise.props({
    statInfo: fs.statAsync(file.path),
    imgInfo : gm(file.path).identifyAsync()
  }).then((result) => {
    const filename = file.name;
    const format   = result.imgInfo.format;
    const ext      = format.toLowerCase();
    let geometry   = result.imgInfo.Geometry;
    const fileSize = result.statInfo.size;
    const size     = result.imgInfo.size;

    const firstFile  = filename.substring(0, 2);
    const secondFile = filename.substring(2, 4);

    if (Array.isArray(geometry)) {
      geometry = geometry[0];
    }

    const filePath = `/${firstFile}/${secondFile}/${filename}-${fileSize}-${geometry}.${ext}`;

    const newPath = path.join(uploadDir, filePath);
    /* eslint-disable */
    fs.mkdirsSync(path.dirname(newPath));
    fs.renameSync(file.path, newPath);
    /* eslint-enable */
    return {
      imageUrl : imageUrl,
      url      : `/images${filePath}`,
      fileSize : fileSize,
      size     : size,
      format   : format,
      originUrl: file.originUrl || ''
    };
  });
}
