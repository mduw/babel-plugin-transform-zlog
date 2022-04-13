import path from 'path';
import { createSelector } from 'reselect';
import { prepareDir, toPosixPath } from './file-utils';
import { name } from '../../package.json';
/**
 * {
 *    replaceSymbFunc: {
 *      <level_func_name_A>: [<new_func_name_A>, {variants: ['R', 'C', 'RC', 'RF']}],
 *      <level_func_name_B>: [<new_func_name_B>, {variants: ['R', 'C', 'RC', 'RF']}]
 *    }
 * }
 * For example:
 * {
 *    info: ['NewInfo', {variants: ['R', 'C']}] // equivalent to (info => NewInfo, infoR => NewInfo, infoC => NewInfo)
 * }
 */

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

function normalizeReplaceCreateFeatFunc(optsReplace) {
  return optsReplace || [];
}

function normalizeReplaceCreateTemplFunc(optsReplace) {
  return optsReplace || [];
}

function normalizeOutPath(optsPath) {
  return toPosixPath(prepareDir(optsPath).result);
}

function normalizePathRegex(optsPathRegex) {
  let regex;
  try {
    regex = new RegExp(optsPathRegex);
  } catch (err) {
    throw new Error(`${name} error: invalid regex of loggerPathRegex`);
  }
  return regex;
}

function normalizeShowLog(optsLog) {
  return optsLog || 'off'; // off by default
}

function normalizeRootDir(optsLog) {
  return optsLog || '';
}

export default createSelector(
  currentFile => (currentFile.includes('.') ? path.dirname(currentFile) : currentFile),
  (_, opts) => opts,
  (currentFile, opts) => {
    const replaceSymbFunc = normalizeReplaceSymbFunc(opts.replaceSymbFunc);
    const replaceCreateFeatFunc = normalizeReplaceCreateFeatFunc(opts.replaceCreateFeatFunc);
    const replaceCreateTemplFunc = normalizeReplaceCreateTemplFunc(opts.replaceCreateTemplFunc);
    const loggerPathRegex = normalizePathRegex(opts.loggerPathRegex);
    const logDataPathRegex = normalizePathRegex(opts.logDataPathRegex);
    const excludePathRegex = normalizePathRegex(opts.excludePathRegex);
    const outPath = normalizeOutPath(opts.outDir);
    const log = normalizeShowLog(opts.log);
    const rootDir = normalizeRootDir(opts.rootDir);
    return {
      replaceSymbFunc,
      replaceCreateFeatFunc,
      replaceCreateTemplFunc,
      loggerPathRegex,
      logDataPathRegex,
      excludePathRegex,
      outDir: outPath,
      rootDir,
      log
    };
  }
);
