import { toPosixPath } from './file-utils';

export function getSouceMapID(sourcePath, SourceMap) {
  const posixPath = toPosixPath(sourcePath);
  if (SourceMap.has(posixPath)) {
    return SourceMap.get(posixPath);
  }
  const autoSmid = SourceMap.size + 1;
  SourceMap.set(posixPath, autoSmid);
  return autoSmid;
}

export function getSymbid(loc, state) {
  const row = loc.start.line;
  const col = loc.start.column;
  const smid = getSouceMapID(state.currentFile, state.SourceMap);
  const symbidKey = `${smid}:${row}:${col}`;

  if (state.SymbolMap.has(symbidKey)) {
    throw new Error('ERROR: duplicate symbol id');
  }
  const autoSymbid = state.SymbolMap.size + 1;
  state.SymbolMap.set(symbidKey, autoSymbid);
  return autoSymbid;
}
