import { createSelector } from 'reselect';
import { ZCipher } from './cipher';
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
  const { hash: incomingHash } = JSON.parse(process.env.ZLOG_BUILD_DETAILS);
  const hashedFileName = `[${incomingHash}]${hashStringShake256(rawFilePath)}.json`;
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

function normalizeTemplateFunc(optsTemplate) {
  return optsTemplate;
}

export default createSelector(
  // The currentFile should have an extension; otherwise it's considered a special value
  currentFile => currentFile,
  (_, opts) => opts,
  (currentFile, opts) => {
    const replaceLoggerInitFunc = normalizeLoggerInit(opts.replaceLoggerInitFunc);
    const templateFunc = normalizeTemplateFunc(opts.templateFunc);
    const excludePathRegex = normalizePathRegex(opts.excludePathRegex);
    const outPath = normalizeOutPath(opts.outDir, currentFile);
    const forceMode = opts.forceMode?.toLowerCase() === 'bin' ? opts.forceMode : '';
    let secrets = {
      secretKey: 'default_key_818_1dxsjx9129bjx+21',
      iv: '008d41f204be33a7aceb31986fa94552',
    };
    try {
      secrets = JSON.parse(process.env.ZLOG_BUILD_DETAILS).cryptoKeys;
    } catch (err) {
      console.log('fail to parse build details', err);
    }
    ZCipher.setSecrets(secrets);
    const log = normalizeShowLog(opts.log);
    return {
      replaceLoggerInitFunc,
      excludePathRegex,
      outDir: outPath,
      log,
      forceMode,
      templateFunc,
      secrets,
    };
  }
);
