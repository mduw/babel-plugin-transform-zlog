import { types } from 'babel-core';
import { GLOBAL_IDENTIFIERS } from '../constant';
import { isGlobalIdentifier } from '../utils/verify-identifier';
import transformLoggerInitCall from './logger-call';
import transformLogSymbCall from './symbol-call';

export default function transformCall(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;

  const callee = nodePath.node.callee || undefined;
  let funcName;
  if (types.isMemberExpression(callee)) funcName = callee.property && callee.property.name;
  else if (types.isIdentifier(callee)) funcName = callee.name;
  if (!callee || !funcName) return;

  if (
    funcName &&
    Object.prototype.hasOwnProperty.call(state.normalizedOpts.replaceSymbFunc, funcName)
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
  } else if (
    funcName &&
    types.isCallExpression(nodePath) &&
    funcName === GLOBAL_IDENTIFIERS.__t
    && isGlobalIdentifier(funcName)
  ) {
    nodePath.replaceWith(state.types.cloneNode(nodePath.get('arguments.0').node));
  }
}
