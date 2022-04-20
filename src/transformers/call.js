import transformLogSymbCall from './symbol-call';
import transformLogTemplCall from './template-call';

export default function transformCall(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;

  const callee = nodePath.node.callee || undefined;
  const funcName = callee.property && callee.property.name;
  if (!callee || !funcName) return;

  if (
    funcName &&
    ((state.types.isMemberExpression(callee) &&
      Object.prototype.hasOwnProperty.call(
        state.normalizedOpts.replaceSymbFunc,
        callee.property.name
      )) ||
      (state.types.isIdentifier(callee) &&
        Object.prototype.hasOwnProperty.call(
          state.normalizedOpts.replaceSymbFunc,
          callee.node.name
        )))
  ) {
    transformLogSymbCall(nodePath, state, funcName);
  } else if (
    funcName &&
    ((state.types.isMemberExpression(callee) &&
      state.normalizedOpts.replaceCreateTemplFunc.includes(callee.property.name)) ||
      (state.types.isIdentifier(callee) &&
        state.normalizedOpts.replaceCreateTemplFunc.includes(callee.node.name)))
  ) {
    transformLogTemplCall(nodePath, state);
  }
}
