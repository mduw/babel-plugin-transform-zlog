import { types } from 'babel-core';
import { GLOBAL_IDENTIFIERS } from '../constant';
import { isGlobalIdentifier } from '../utils/verify-identifier';

function transformTagTemplLiteral2TemplLiteral(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);
  const currentQuasi = nodePath.get('quasi');
  if (types.isTemplateLiteral(currentQuasi)) {
    return state.types.cloneNode(currentQuasi.node);
  }
  return nodePath;
}

export function transformGlobalTagExpression(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);
  const currentTag = nodePath.get('tag');
  const currentQuasi = nodePath.get('quasi');
  if (
    currentTag.node.name === GLOBAL_IDENTIFIERS.__t &&
    types.isTemplateLiteral(currentQuasi) &&
    isGlobalIdentifier(nodePath, GLOBAL_IDENTIFIERS.__t)
  ) {
    nodePath.replaceWith(transformTagTemplLiteral2TemplLiteral(currentQuasi, state));
  }
}
