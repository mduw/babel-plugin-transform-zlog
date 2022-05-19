export function isBinaryMode(forceMode = 'unknown') {
  switch (forceMode) {
    case 'txt':
      return false;
    case 'bin':
      return true;
    default: {
      // unknown
      const NODE_ENV = process.env_NODE_ENV || 'unknown';
      if (NODE_ENV === 'development' || NODE_ENV === 'test') return false;
      const BUILD_ENV = process.env.BUILD_ENV || 'production';
      const BUILD_TYPE = process.node.BUILD_TYPE || 'unknown';
      if (BUILD_ENV === 'production' && BUILD_TYPE === 'release') return true; // only binary on prod: release
      return false;
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
