import { types } from 'babel-core';
import { toPosixPath } from '../utils/file-utils';
import { getSymbid } from '../utils/map-utils';

export default function transformLogSymbCall(nodePath, state, funcName) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);

  const targetFuncNames = state.normalizedOpts.replaceSymbFunc;
  const callee = nodePath.node.callee || undefined;
  if (!callee || !funcName || !targetFuncNames) return;

  const loc = nodePath.get('loc').node;
  const symbid = getSymbid(loc, state);

  // convert call func to logSymbol
  nodePath.node.callee = state.types.memberExpression(
    callee.object,
    state.types.identifier(targetFuncNames[funcName]),
    false
  );

  if (funcName && funcName.endsWith('R') || (funcName.length >= 2 && funcName[funcName.length - 2] === 'R')) {
    const loc = nodePath.get('loc').node;
    const row = loc.start.line;
    const sourcemap = toPosixPath(state.currentFile)
      .split('/')
      .slice(-2)
      .join('/');
    nodePath.node.arguments.unshift(
      types.objectExpression([
        types.objectProperty(types.identifier('mid'), types.numericLiteral(-1)),
        types.objectProperty(types.identifier('fid'), types.numericLiteral(-1)),
        types.objectProperty(types.identifier('lid'), types.numericLiteral(-1)),
        types.objectProperty(
          types.identifier('tags'),
          types.objectExpression([
            types.objectProperty(
              types.identifier('process'),
              types.stringLiteral(state.normalizedOpts.process)
            ),
            types.objectProperty(types.identifier('sourcemap'), types.stringLiteral(sourcemap)),
            types.objectProperty(types.identifier('row'), types.numericLiteral(row)),
          ])
        ),
      ])
    );
  }

  // convert data
  nodePath.node.arguments.unshift(state.types.numericLiteral(symbid));
  nodePath.node.arguments.unshift(state.types.stringLiteral(funcName));
}
