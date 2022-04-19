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

  // convert data
  nodePath.node.arguments.unshift(state.types.numericLiteral(symbid));
  nodePath.node.arguments.unshift(state.types.stringLiteral(funcName));
}
