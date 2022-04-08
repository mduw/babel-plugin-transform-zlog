import path from 'path';
import resolve from 'resolve';
import { invertObjectKeyValue } from './object-utils';

export function nodeResolvePath(modulePath, basedir, extensions) {
  try {
    return resolve.sync(modulePath, { basedir, extensions });
  } catch (e) {
    return null;
  }
}

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

  const dirPath = path.join(dir, 'log');
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

export function writeDataWithMode(outDir, data, mode) {
  /* eslint-disable global-require */
  const fs = require('fs');
  if (fs.existsSync(outDir)) {
    fs.unlinkSync(outDir);
  }
  fs.writeFileSync(outDir, data);
  fs.chmodSync(outDir, mode);
}

export function writeSourceMapSync(outDir, SourceMap, mode) {
  /* eslint-disable global-require */
  const data = JSON.stringify(invertObjectKeyValue(Object.fromEntries(SourceMap)));
  writeDataWithMode(outDir, data, mode);
}


export function writeSymbolMapSync(outDir, SymbolMap, mode) {
  /* eslint-disable global-require */
  const data = JSON.stringify(invertObjectKeyValue(Object.fromEntries(SymbolMap)));
  writeDataWithMode(outDir, data, mode);
}

export function writeImports(outDir, SourceMap, mode) {
  /* eslint-disable global-require */
  const data = JSON.stringify(Object.fromEntries(SourceMap));
  writeDataWithMode(outDir, data, mode);
}
