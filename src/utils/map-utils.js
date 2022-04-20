import { log } from '../log';
import { shortenPath, toPosixPath } from './file-utils';

export function getSouceMapID(posixPath, SourceMap) {
  // const posixPath = toPosixPath(sourcePath);
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
  const smid = getSouceMapID(
    shortenPath(state.normalizedOpts.rootDir, state.currentFile),
    state.SourceMap
  );
  const symbidKey = `${smid}:${row}:${col}`;
  if (state.SymbolMap.has(symbidKey)) {
    return state.SymbolMap.get(symbidKey);
  }
  const autoSymbid = state.SymbolMap.size + 1;
  state.SymbolMap.set(symbidKey, autoSymbid);
  return autoSymbid;
}
