import { types } from 'babel-core';
import { GLOBAL_IDENTIFIERS } from '../constant';
import { UIDManager } from '../utils/id-gen';
import { Indexer } from '../utils/log-indexer';
import { EnumeratedLevels } from '../utils/log-levels/enumerator';
import { isBinaryMode, isTextMode } from '../utils/parse-mode';
import { isGlobalIdentifier } from '../utils/verify-identifier';

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

function transformTemplTagExpression(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);
  const currentTag = nodePath.get('tag');
  const currentQuasi = nodePath.get('quasi');
  const params = [];
  if (
    currentTag.node.name === state.normalizedOpts.templateFunc &&
    types.isTemplateLiteral(currentQuasi) &&
    isGlobalIdentifier(nodePath, state.normalizedOpts.templateFunc)
  ) {
    const [templateStr, expressionArrNode] = transformTemplateLiteral(currentQuasi, state);
    if (isTextMode(state.normalizedOpts.forceMode)) {
      Indexer.addOrGetMap(Indexer.keys.templ, templateStr, state);
      params.push(types.stringLiteral(templateStr));
    } else if (isBinaryMode(state.normalizedOpts.forceMode)) {
      const lid = Indexer.addOrGetMap(Indexer.keys.templ, templateStr, state);
      params.push(types.stringLiteral(lid));
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
  const x = new UIDManager(12);
  const targetFuncNames = state.normalizedOpts.replaceSymbFunc;
  const callee = nodePath.node.callee || undefined;
  if (!callee || !funcName || !targetFuncNames) return;

  const loc = nodePath.get('loc').node;
  const row = loc.start.line;

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
    nodePath.node.arguments.unshift(types.numericLiteral(row));
    nodePath.node.arguments.unshift(types.numericLiteral(EnumeratedLevels[funcName.concat('T')]));
    // nodePath.node.arguments.unshift(types.stringLiteral(funcName.concat('T')));
  } else {
    nodePath.node.arguments.unshift(types.numericLiteral(row));
    nodePath.node.arguments.unshift(types.numericLiteral(EnumeratedLevels[funcName]));
    // nodePath.node.arguments.unshift(types.stringLiteral(funcName));
  }
}
