import { types } from 'babel-core';
import { GLOBAL_IDENTIFIERS } from '../constant';
import { Indexer } from '../utils/log-indexer';
import { EnumeratedLevels } from '../utils/log-levels/enumerator';
import { getSymbid } from '../utils/map-utils';

const PlaceholderSign = '{}';

export function transformTemplateLiteral(nodePath, state) {
  const expressions = nodePath.get('expressions');
  const quasis = nodePath.get('quasis');
  const NewExp = [];
  let templateStr = '';
  while (quasis.length) {
    const topQuasis = quasis[0];
    const topExpr = expressions.length ? expressions[0] : null;
    if (topExpr) {
      // check pos
      const topQuasisStart = topQuasis.node.start;
      const topExprStart = topExpr.node.start; // dev: get('loc').node.start.index
      if (topQuasisStart < topExprStart) {
        templateStr += topQuasis.node.value.cooked;
        quasis.shift();
      } else {
        templateStr += PlaceholderSign;
        NewExp.push(expressions[0]);
        expressions.shift();
      }
    } else {
      templateStr += topQuasis.node.value.cooked;
      quasis.shift();
    }
  }
  return [templateStr, NewExp];
}
function isGlobalIdentifier(nodePath, identifier) {
  const { globals } = nodePath.scope;
  if (Object.prototype.hasOwnProperty.call(globals, identifier)) {
    return true;
  }
  return false;
}
function transformTemplTagExpression(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);
  const currentTag = nodePath.get('tag');
  const currentQuasi = nodePath.get('quasi');
  const params = [];
  if (
    currentTag.node.name === GLOBAL_IDENTIFIERS.__t &&
    types.isTemplateLiteral(currentQuasi)
    // && isGlobalIdentifier(nodePath, GLOBAL_IDENTIFIERS.__t)
  ) {
    const [templateStr, expressionArrNode] = transformTemplateLiteral(currentQuasi, state);
    if (
      state.normalizedOpts.forceMode === 'txt' &&
      (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
    ) {
      params.push(types.stringLiteral(templateStr));
    } else if (state.normalizedOpts.forceMode === 'bin') {
      const lid = Indexer.addOrGetMap(Indexer.keys.templ, templateStr, state);
      params.push(types.numericLiteral(lid));
    }

    for (let i = 0; i < expressionArrNode.length; i++) {
      params.push(state.types.cloneNode(expressionArrNode[i].node));
    }
  }
  return params;
}

export default function transformLogSymbCall(nodePath, state, funcName) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);

  const targetFuncNames = state.normalizedOpts.replaceSymbFunc;
  const callee = nodePath.node.callee || undefined;
  if (!callee || !funcName || !targetFuncNames) return;

  const loc = nodePath.get('loc').node;
  const row = loc.start.line;
  // const symbid = getSymbid(loc, state);

  // convert call func to logSymbol
  nodePath.node.callee = state.types.memberExpression(
    callee.object,
    state.types.identifier(targetFuncNames[funcName]),
    false
  );

  const CallExpArgs = nodePath.get('arguments');
  const FirstExpArg = CallExpArgs[0];
  if (types.isTaggedTemplateExpression(FirstExpArg)) {
    const params = transformTemplTagExpression(FirstExpArg, state);
    if (params.length) {
      nodePath.node.arguments.shift();
      for (let i = params.length - 1; i >= 0; i--) {
        nodePath.node.arguments.unshift(params[i]);
      }
    }
  }
  nodePath.node.arguments.unshift(types.numericLiteral(row));
  nodePath.node.arguments.unshift(types.numericLiteral(EnumeratedLevels[funcName.concat('T')]));
}
