export function isBinaryMode(forceMode = 'unknown') {
  switch (forceMode) {
    case 'txt':
      return false;
    case 'bin':
      return true;
    default: {
      // unknown
      // const NODE_ENV = process.env_NODE_ENV || 'unknown';
      // if (NODE_ENV === 'development' || NODE_ENV === 'test') return false;
      const ZLOG_BUILD_ENV = process.env.ZLOG_BUILD_ENV || 'production';
      // const ZLOG_BUILD_TYPE = process.env.ZLOG_BUILD_TYPE || 'unknown';
      // if (ZLOG_BUILD_ENV === 'production' && ZLOG_BUILD_TYPE === 'release') return true; // only binary on prod: release
      // return false;
      return ZLOG_BUILD_ENV === 'production' || ZLOG_BUILD_ENV === 'test';
    }
  }
}

export function isTextMode(forceMode = 'unknown') {
  switch (forceMode) {
    case 'txt':
      return true;
    case 'bin':
      return false;
    default: {
      // unknown
      if (isBinaryMode(forceMode)) return false; // only binary on prod
      return true;
    }
  }
}

export function isUsrReleaseMode() {
  const ZLOG_BUILD_ENV = process.env.ZLOG_BUILD_ENV || 'production';
  const ZLOG_BUILD_TYPE = process.env.ZLOG_BUILD_TYPE || 'unknown';
  return ZLOG_BUILD_ENV === 'production' && ZLOG_BUILD_TYPE === 'release';
}
