import { types } from 'babel-core';
import { colorize, COLORS } from '../utils/log/color';
import transformLoggerInitCall from './logger-call';
import transformLogSymbCall from './symbol-call';

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
    types.isCallExpression(nodePath) &&
    state.normalizedOpts.replaceLoggerInitFunc &&
    state.normalizedOpts.replaceLoggerInitFunc.includes(funcName) &&
    types.isCallExpression(nodePath)
  ) {
    transformLoggerInitCall(nodePath, state, funcName);
  }
}
