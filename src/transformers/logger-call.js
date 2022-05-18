import { types } from 'babel-core';
import { TransformInitLoggerError } from '../errors/errors';
import { shortenPath2, toPosixPath } from '../utils/file-utils';
import { Indexer } from '../utils/log-indexer';
import { getSouceMapID } from '../utils/map-utils';

export default function transformLoggerInitCall(nodePath, state, funcName) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);

  const callee = nodePath.node.callee || undefined;
  if (!callee || !funcName) return;

  const loc = nodePath.get('loc').node;
  const row = loc.start.line;
  const sourcemap = `${toPosixPath(state.currentFile)}:${row}`;

  const args = nodePath.get('arguments');
  if (args && (args.length < 2 || args.length > 3))
    throw new TransformInitLoggerError('at least 2 parameters required!!', sourcemap).error;

  const mid = nodePath.get('arguments.0');
  if (!types.isStringLiteral(mid))
    throw new TransformInitLoggerError('params[0] must be a type of string', sourcemap).error;

  const fid = nodePath.get('arguments.1');
  if (!types.isArrayExpression(fid) || fid.get('elements').length === 0)
    throw new TransformInitLoggerError('params[1] must be a type of string[]', sourcemap).error;
  if (
    state.normalizedOpts.forceMode === 'txt' &&
    (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  ) {
    if (nodePath.node.arguments.length === 2) {
      nodePath.node.arguments.push(types.nullLiteral());
    }
    Indexer.addOrGetMap(Indexer.keys.nametag, mid.node.value, state);
    nodePath.node.arguments.push(types.stringLiteral(shortenPath2(state.currentFile)));
  } else if (state.normalizedOpts.forceMode === 'bin') {
    nodePath.node.arguments[0] = types.numericLiteral(
      Indexer.addOrGetMap(Indexer.keys.nametag, mid.node.value, state)
    );

    for (let i = 0; i < fid.get('elements').length; i++) {
      fid.node.elements[i] = types.numericLiteral(
        Indexer.addOrGetMap(Indexer.keys.nametag, fid.get(`elements.${i}`).node.value, state)
      );
    }
    if (nodePath.node.arguments.length >= 3) {
      nodePath.node.arguments.push(
        types.numericLiteral(getSouceMapID(this.currentFile, state.SourceMap))
      );
    } else {
      if (nodePath.node.arguments.length === 2) {
        nodePath.node.arguments.push(types.nullLiteral());
      }
      nodePath.node.arguments.push(
        types.numericLiteral(
          nodePath.node.arguments.push(
            types.numericLiteral(getSouceMapID(this.currentFile, state.SourceMap))
          )
        )
      );
    }
  }
}
