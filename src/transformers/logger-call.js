import { types } from 'babel-core';
import { TransformInitLoggerError } from '../errors/errors';
import { toPosixPath } from '../utils/file-utils';
import { ImportsHelper } from '../utils/import-helper';
import { Indexer } from '../utils/log-indexer';

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

  ImportsHelper.insertImports(state.programPath, ImportsHelper.insertKeys.zmid);
  nodePath.node.arguments[0] = types.memberExpression(
    types.identifier(ImportsHelper.insertKeys.zmid),
    types.numericLiteral(Indexer.addOrGetMap('mid', mid.node.value, state)),
    true
  );

  ImportsHelper.insertImports(state.programPath, ImportsHelper.insertKeys.zfid);
  for (let i = 0; i < fid.get('elements').length; i++) {
    fid.node.elements[i] = types.memberExpression(
      types.identifier(ImportsHelper.insertKeys.zfid),
      types.numericLiteral(Indexer.addOrGetMap('fid', fid.get(`elements.${i}`).node.value, state)),
      true
    );
  }
}
