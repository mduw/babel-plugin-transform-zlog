import { types } from 'babel-core';
import { ImportsHelper } from '../utils/import-helper';
import { Indexer } from '../utils/log-indexer';
import { EnumeratedLevels } from '../utils/log-levels/enumerator';
import { getSymbid } from '../utils/map-utils';

const PlaceholderSign = '{}';
const Blankspace = ' ';

function transformTemplateBinaryExpression(nodePath, state, str = '', args = []) {
  if (types.isBinaryExpression(nodePath)) {
    const left = nodePath.get('left');
    const right = nodePath.get('right');
    let transformedData = transformTemplateBinaryExpression(left, state, str, args);
    str += transformedData[0];
    args = [...args, ...transformedData[1]];
    transformedData = transformTemplateBinaryExpression(right, state, str, args);
    str += transformedData[0];
    args = [...args, ...transformedData[1]];
  } else if (types.isTemplateLiteral(nodePath)) {
    const expressions = nodePath.get('expressions');
    const quasis = nodePath.get('quasis');
    let tempStr = '';
    const tempArgs = [];
    while (quasis.length) {
      const topQuasis = quasis[0];
      const topExpr = expressions.length ? expressions[0] : null;
      if (topExpr) {
        // check pos
        const topQuasisStart = topQuasis.get('loc').node.start.index;
        const topExprStart = topExpr.get('loc').node.start.index;
        if (topQuasisStart < topExprStart) {
          tempStr += topQuasis.node.value.cooked;
          quasis.shift();
        } else {
          tempStr += PlaceholderSign;
          tempArgs.push(topExpr);
          expressions.shift();
        }
      } else {
        tempStr += topQuasis.node.value.cooked;
        quasis.shift();
      }
    }
    return [tempStr, tempArgs];
  } else if (types.isStringLiteral(nodePath)) {
    return [nodePath.node.value, []];
  } else {
    return [PlaceholderSign, [nodePath]];
  }
  return [str, args];
}

function transformStringLiteral(nodePath, state) {
  const template = nodePath.node.value;
  return [template, []];
}

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
      const topQuasisStart = topQuasis.get('loc').node.start.index;
      const topExprStart = topExpr.get('loc').node.start.index;
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

  const CallExpArgs = nodePath.get('arguments');
  let ParsedTempl = '';
  const NewCallExpArgs = [];
  let lastTemplateIndex = -1;
  for (let i = 0; i < CallExpArgs.length; i++) {
    if (ParsedTempl !== '') {
      ParsedTempl = ParsedTempl.concat(Blankspace);
    }
    const currentNode = CallExpArgs[i];
    if (types.isBinaryExpression(currentNode)) {
      const [templateStr, expressionsArrNode] = transformTemplateBinaryExpression(
        currentNode,
        state
      );
      ParsedTempl = ParsedTempl.concat(templateStr);
      expressionsArrNode.forEach(expr => {
        NewCallExpArgs.push(expr);
      });
      lastTemplateIndex = ParsedTempl.length;
    } else if (types.isStringLiteral(currentNode)) {
      const [templateStr] = transformStringLiteral(currentNode, state);
      ParsedTempl = ParsedTempl.concat(templateStr);
      lastTemplateIndex = ParsedTempl.length;
    } else if (types.isTemplateLiteral(currentNode)) {
      const [templateStr, expressionsArrNode] = transformTemplateLiteral(currentNode, state);
      ParsedTempl = ParsedTempl.concat(templateStr);
      expressionsArrNode.forEach(expr => {
        NewCallExpArgs.push(expr);
      });
      lastTemplateIndex = ParsedTempl.length;
    } else {
      ParsedTempl = ParsedTempl.concat(PlaceholderSign);
      NewCallExpArgs.push(currentNode);
    }
  }
  const NodeArgs = [];
  ImportsHelper.insertImports(state.programPath, ImportsHelper.insertKeys.zLogFn);
  NodeArgs.push(
    types.memberExpression(
      types.identifier(ImportsHelper.insertKeys.zLogFn),
      state.types.numericLiteral(EnumeratedLevels[funcName]),
      true
    )
  );

  ImportsHelper.insertImports(state.programPath, ImportsHelper.insertKeys.zsymbs);
  NodeArgs.push(
    types.memberExpression(
      types.identifier(ImportsHelper.insertKeys.zsymbs),
      state.types.numericLiteral(symbid),
      true
    )
  );
  ParsedTempl = ParsedTempl.slice(0, lastTemplateIndex);
  if (ParsedTempl.length) {
    ImportsHelper.insertImports(state.programPath, ImportsHelper.insertKeys.ztempls);
    const lid = Indexer.addOrGetMap(Indexer.keys.templ, ParsedTempl, state);
    NodeArgs.push(
      types.memberExpression(
        state.types.identifier(ImportsHelper.insertKeys.ztempls),
        types.numericLiteral(lid),
        true
      )
    );
  }

  for (let i = 0; i < NewCallExpArgs.length; i++) {
    NodeArgs.push(state.types.cloneNode(NewCallExpArgs[i].node));
  }

  nodePath.node.arguments = NodeArgs;
}
