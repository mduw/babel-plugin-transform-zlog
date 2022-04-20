import path from 'path';
import { invertObjectKeyValue } from './object-utils';

export function isRelativePath(nodePath) {
  return nodePath.match(/^\.?\.\//);
}

export function toPosixPath(modulePath) {
  if (!modulePath) return '';
  return modulePath.replace(/\\/g, '/');
}

export function toLocalPath(modulePath) {
  let localPath = modulePath.replace(/\/index$/, ''); // remove trailing /index
  if (!isRelativePath(localPath)) {
    localPath = `./${localPath}`; // insert `./` to make it a relative path
  }
  return localPath;
}

export function stripExtension(modulePath, stripExtensions) {
  let name = path.basename(modulePath);
  stripExtensions.some(extension => {
    if (name.endsWith(extension)) {
      name = name.slice(0, name.length - extension.length);
      return true;
    }
    return false;
  });
  return name;
}

export function replaceExtension(modulePath, opts) {
  const filename = stripExtension(modulePath, opts.stripExtensions);
  return path.join(path.dirname(modulePath), filename);
}

export function matchesPattern(types, calleePath, pattern) {
  const { node } = calleePath;

  if (types.isMemberExpression(node)) {
    return calleePath.matchesPattern(pattern);
  }

  if (!types.isIdentifier(node) || pattern.includes('.')) {
    return false;
  }

  const name = pattern.split('.')[0];

  return node.name === name;
}

export function isImportCall(types, calleePath) {
  return types.isImport(calleePath.node.callee);
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mkDir(dirPath, rootPath) {
  const dirs = dirPath.split(path.sep);
  const dir = dirs.shift();
  const root = (rootPath || '') + dir + path.sep;
  /* eslint-disable global-require */
  const fs = require('fs');
  try {
    fs.mkdirSync(root);
  } catch (e) {
    if (!fs.statSync(root).isDirectory()) {
      throw new Error(e);
    }
  }

  return !dirs.length || mkDir(dirs.join(path.sep), root);
}

export function prepareDir(dir) {
  if (!dir) {
    return { or: prepareDir };
  }

  const dirPath = path.join(dir);
  // jshint -W040
  if (!this || this.or !== prepareDir || !this.result) {
    if (!dirPath) {
      return { or: prepareDir };
    }

    mkDir(dirPath);
    /* eslint-disable global-require */
    const fs = require('fs');

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

function doWriteData(outPath, fData, opts) {
  const fs = require('fs');
  return new Promise((resolve, reject) => {
    try {
      const now = new Date().toLocaleString();
      const data2write = JSON.stringify({
        vers: opts && opts.vers ? opts.vers : null,
        lastModifed: now,
        data: fData,
      });
      fs.writeFile(outPath, data2write, werr => {
        if (werr) {
          reject(werr);
          throw new Error(`fail to write ${outPath} ${werr}`);
        }
        // fs.chmod(outPath, fs.constants.O_RDONLY, modeErr => {
        //   if (modeErr) {
        //     reject(modeErr);
        //     throw new Error(`fail to write ${outPath} ${modeErr}`);
        //   }
        //   resolve(true);
        // });
        resolve(true);
      });
    } catch (error) {
      reject(error);
      throw new Error(`fail to write ${outPath} ${error}`);
    }
  });
}

export function writeExtractedDataToFile(pathStr, data, options) {
  /* eslint-disable global-require */
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const outDir = toPosixPath(pathStr);
    // const data = invertObjectKeyValue(Object.fromEntries(map));

    if (fs.existsSync(outDir)) {
      fs.readFile(outDir, (err, oldData) => {
        const oldDataObj = JSON.parse(oldData.toString());
        const mergedData = oldDataObj.data
          ? {
              ...oldDataObj.data,
              ...data,
            }
          : data;
        if (err) {
          reject(err);
          throw new Error(`fail to overwrite ${outDir} ${err}`);
        }
        doWriteData(outDir, mergedData, options)
          .then(resolve)
          .catch(reject);
      });
    } else {
      doWriteData(outDir, data, options)
        .then(resolve)
        .catch(reject);
    }
  });
}

export function shortenPath(rootDir, fPath) {
  let posixPath = toPosixPath(fPath);
  const posixPathArr = posixPath.split('/');
  const rootIndex = posixPathArr.indexOf(rootDir);
  posixPath = posixPathArr.slice(rootIndex).join('/');
  return posixPath || fPath;
}
