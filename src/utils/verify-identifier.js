export function isGlobalIdentifier(nodePath, identifierName) {
  const globals = nodePath.scope?.globals;
  const envMode = process.env.BABEL_PLUGIN_TRANSFORM_ZLOG_MODE;

  if (!globals) {
    if (envMode && envMode === 'test') return true;
    throw new Error('Error: global scope == undefined');
  }
  if (Object.prototype.hasOwnProperty.call(globals, identifierName)) {
    return true;
  }
  return false;
}
