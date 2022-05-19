const fs = require('fs');
const path = require('path');

function mkDir(dirPath, root) {
  const dirs = dirPath.split(path.sep);
  const dir = dirs.shift();
  root = (root || '') + dir + path.sep;

  try {
    fs.mkdirSync(root);
  } catch (e) {
    if (!fs.statSync(root).isDirectory()) {
      throw new Error(e);
    }
  }

  return !dirs.length || mkDir(dirs.join(path.sep), root);
}

function prepareDir(dirPath) {
  dirPath = path.join(dirPath, 'log');
  // jshint -W040
  if (!this || this.or !== prepareDir || !this.result) {
    if (!dirPath) {
      return { or: prepareDir };
    }

    // noinspection JSCheckFunctionSignatures
    dirPath = path.join.apply(path, arguments);
    mkDir(dirPath);

    try {
      fs.accessSync(dirPath, fs.W_OK);
    } catch (e) {
      return { or: prepareDir };
    }
  }

  return {
    or: prepareDir,
    result: (this ? this.result : false) || dirPath,
  };
}

function findLogPath(dirName, fileName = '') {
  const dir = prepareDir(dirName).result;
  if (dir) {
    if (fileName) {
      return path.join(dir, fileName);
    }
    return dir;
  }
  return '';
}

export { findLogPath };
