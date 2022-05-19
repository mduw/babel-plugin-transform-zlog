import { types } from 'babel-core';
import { TransformInitLoggerError } from '../errors/errors';
import { shortenPath2, toPosixPath } from '../utils/file-utils';
import { Indexer } from '../utils/log-indexer';
import { isBinaryMode, isTextMode } from '../utils/parse-mode';

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

  // ========================================================================================= //

  const sourcemapID = Indexer.addOrGetMap(Indexer.keys.sourcemap, state.currentFile, state);
  const moduleID = Indexer.addOrGetMap(Indexer.keys.nametag, mid.node.value, state);
  const featureID = [];
  for (let i = 0; i < fid.get('elements').length; i++) {
    featureID.push(
      types.stringLiteral(
        Indexer.addOrGetMap(Indexer.keys.nametag, fid.get(`elements.${i}`).node.value, state)
      )
    );
  }

  if (isTextMode(state.normalizedOpts.forceMode)) {
    if (nodePath.node.arguments.length === 2) {
      nodePath.node.arguments.push(types.nullLiteral());
    }
    nodePath.node.arguments.push(types.stringLiteral(shortenPath2(state.currentFile)));
  } else if (isBinaryMode(state.normalizedOpts.forceMode)) {
    nodePath.node.arguments[0] = types.stringLiteral(moduleID);

    nodePath.node.arguments[1] = types.arrayExpression(featureID);
    if (nodePath.node.arguments.length >= 3) {
      nodePath.node.arguments.push(types.stringLiteral(sourcemapID));
    } else {
      if (nodePath.node.arguments.length === 2) {
        nodePath.node.arguments.push(types.nullLiteral());
      }
      nodePath.node.arguments.push(types.stringLiteral(sourcemapID));
    }
  }
}
