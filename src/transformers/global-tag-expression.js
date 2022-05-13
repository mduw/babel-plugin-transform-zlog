import { types } from 'babel-core';
import { GLOBAL_IDENTIFIERS, ModuleProps } from '../constant';
import { ImportsHelper } from '../utils/import-helper';
import { Indexer } from '../utils/log-indexer';
import { transformTemplateLiteral } from './symbol-call';

function isGlobalIdentifier(nodePath, identifier) {
  const { globals } = nodePath.scope;
  if (Object.prototype.hasOwnProperty.call(globals, identifier)) {
    return true;
  }
  return true;
}

export function transformGlobalTagExpression(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);
  const currentTag = nodePath.get('tag');
  const currentQuasi = nodePath.get('quasi');
  if (
    currentTag.node.name === GLOBAL_IDENTIFIERS.__raw &&
    types.isTemplateLiteral(currentQuasi) &&
    isGlobalIdentifier(nodePath, GLOBAL_IDENTIFIERS.__raw)
  ) {
    nodePath.replaceWith(currentQuasi);
  } else if (
    currentTag.node.name === GLOBAL_IDENTIFIERS.__t &&
    types.isTemplateLiteral(currentQuasi) &&
    isGlobalIdentifier(nodePath, GLOBAL_IDENTIFIERS.__t)
  ) {
    const [templateStr, expressionArrNode] = transformTemplateLiteral(currentQuasi, state);
    const lid = Indexer.addOrGetMap(Indexer.keys.templ, templateStr, state);
    ImportsHelper.insertImports(state.programPath, ImportsHelper.insertKeys.ztempls);
    const newExpressionArgs = [
      types.memberExpression(
        types.identifier(ImportsHelper.insertKeys.ztempls),
        types.numericLiteral(lid),
        true
      ),
    ];
    for (let i = 0; i < expressionArrNode.length; i++) {
      newExpressionArgs.push(state.types.cloneNode(expressionArrNode[i].node));
    }

    ImportsHelper.insertImports(state.programPath, ImportsHelper.insertKeys.ztempls);
    nodePath.replaceWith(
      types.callExpression(
        types.memberExpression(
          types.identifier(ImportsHelper.insertKeys.ztempls),
          types.identifier(ModuleProps._$entity)
        ),
        newExpressionArgs
      )
    );
  }
}
