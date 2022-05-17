export function isGlobalIdentifier(nodePath, identifier) {
  const { globals } = nodePath.scope;
  if(!globals) throw new Error("Error: global scope == undefined");
  if (Object.prototype.hasOwnProperty.call(globals, identifier)) {
    return true;
  }
  return false;
}
