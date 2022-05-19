import { createSelector } from 'reselect';
import { findLogPath } from './file-helper';
import { hashStringShake256, toPosixPath } from './file-utils';
import { isUsrReleaseMode } from './parse-mode';

function normalizeReplaceSymbFunc(optsReplace) {
  const matchedOptsReplace = {};
  if (!optsReplace) return {};
  Object.keys(optsReplace).forEach(toReplaceFunc => {
    const replaceItem = optsReplace[toReplaceFunc];
    if (replaceItem.length > 0) {
      const replaceByFunc = replaceItem[0];
      if (replaceItem.length > 1) {
        replaceItem[1].variants.forEach(variant => {
          if (variant === 'self') {
            matchedOptsReplace[toReplaceFunc] = replaceByFunc;
          } else {
            matchedOptsReplace[toReplaceFunc + variant] = replaceByFunc;
          }
        });
      } else {
        matchedOptsReplace[toReplaceFunc] = replaceByFunc;
      }
    }
  });
  return matchedOptsReplace || {};
}

function normalizeOutPath(dirname, rawFilePath) {
  const isReleasable = isUsrReleaseMode();
  const hashedFileName = isReleasable
    ? hashStringShake256(rawFilePath).concat('.json')
    : rawFilePath;
  return toPosixPath(findLogPath(dirname, hashedFileName));
}

function normalizePathRegex(optsPathRegex) {
  let regex;
  try {
    regex = new RegExp(optsPathRegex);
  } catch (err) {
    throw new Error(`error: invalid regex of loggerPathRegex`);
  }
  return regex;
}

function normalizeShowLog(optsLog) {
  return optsLog || 'off'; // off by default
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function normalizeProcess(optsProcess) {
  return optsProcess ? capitalizeFirstLetter(optsProcess) : '';
}

function normalizeLoggerInit(optsInitFuncName) {
  return optsInitFuncName || '';
}

export default createSelector(
  // The currentFile should have an extension; otherwise it's considered a special value
  currentFile => currentFile,
  (_, opts) => opts,
  (currentFile, opts) => {
    const replaceSymbFunc = normalizeReplaceSymbFunc(opts.replaceSymbFunc);
    const replaceLoggerInitFunc = normalizeLoggerInit(opts.replaceLoggerInitFunc);
    const excludePathRegex = normalizePathRegex(opts.excludePathRegex);
    const outPath = normalizeOutPath(opts.outDir, currentFile);
    const forceMode = opts.forceMode?.toLowerCase() === 'bin' ? opts.forceMode : 'txt';

    const log = normalizeShowLog(opts.log);
    return {
      replaceSymbFunc,
      replaceLoggerInitFunc,
      excludePathRegex,
      outDir: outPath,
      log,
      forceMode,
    };
  }
);
