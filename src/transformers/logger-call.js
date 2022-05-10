import { types } from 'babel-core';
import { ParserError, TransformInitLoggerError } from '../errors/errors';
import { toPosixPath } from '../utils/file-utils';
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

  const midNode = types.objectExpression([
    types.objectProperty(
      types.identifier('id'),
      types.numericLiteral(Indexer.addOrGetMap('mid', mid.node.value, state))
    ),
    types.objectProperty(types.identifier('name'), types.stringLiteral(mid.node.value)),
    types.objectProperty(
      types.identifier('process'),
      types.stringLiteral(state.normalizedOpts.process)
    ),
  ]);
  const fidNode = types.objectExpression([
    types.objectProperty(
      types.identifier('id'),
      types.numericLiteral(Indexer.addOrGetMap('fid', fid.get('elements.0').node.value, state))
    ),
    types.objectProperty(types.identifier('names'), types.arrayExpression(fid.node.elements)),
    types.objectProperty(
      types.identifier('process'),
      types.stringLiteral(state.normalizedOpts.process)
    ),
  ]);

  nodePath.node.arguments[0] = midNode;
  nodePath.node.arguments[1] = fidNode;
}
