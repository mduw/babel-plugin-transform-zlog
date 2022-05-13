import path from 'path';
import { createSelector } from 'reselect';
import { prepareDir, toPosixPath } from './file-utils';

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
    throw new Error(`error: invalid regex of loggerPathRegex`);
  }
  return regex;
}

function normalizeShowLog(optsLog) {
  return optsLog || 'off'; // off by default
}

function normalizeRootDir(optsLog) {
  return optsLog || '';
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
  currentFile => (currentFile.includes('.') ? path.dirname(currentFile) : currentFile),
  (_, opts) => opts,
  (currentFile, opts) => {
    const replaceSymbFunc = normalizeReplaceSymbFunc(opts.replaceSymbFunc);
    const replaceLoggerInitFunc = normalizeLoggerInit(opts.replaceLoggerInitFunc);
    const excludePathRegex = normalizePathRegex(opts.excludePathRegex);
    const process = normalizeProcess(opts.process);
    const log = normalizeShowLog(opts.log);
    const rootDir = normalizeRootDir(opts.rootDir);
    const outPath = normalizeOutPath(opts.outDir);

    return {
      replaceSymbFunc,
      replaceLoggerInitFunc,
      excludePathRegex,
      outDir: outPath,
      rootDir,
      log,
      process,
    };
  }
);
