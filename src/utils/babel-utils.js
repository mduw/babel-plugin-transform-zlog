import { types } from 'babel-core';

export function isUndefinedIdentifier(nodePath) {
  return types.isIdentifier(nodePath.node) && nodePath.node.value === 'undefined';
}

export function isNullLiteral(nodePath) {
  return types.isNullLiteral(nodePath.node);
}

export function isCallbackFunc(nodePath) {
  return (
    types.isArrowFunctionExpression(nodePath.node) || types.isFunctionExpression(nodePath.node)
  );
}

export function isObjectExpression(nodePath) {
  return types.isObjectExpression(nodePath.node);
}

export function isCallExpression(nodePath) {
  return types.isCallExpression(nodePath.node);
}

export function isValidTemplCallback(nodePath, state) {
  return (
    isCallbackFunc(nodePath) &&
    nodePath.node.params.length === 1 &&
    state.replaceCreateTemplFunc.includes(nodePath.node.params[0].name)
  );
}
