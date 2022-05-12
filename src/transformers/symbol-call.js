import { types } from 'babel-core';
import { TransformInitLoggerError, TransformSymbolLogError } from '../errors/errors';
import { toPosixPath } from '../utils/file-utils';
import { Indexer } from '../utils/log-indexer';
import { getSymbid } from '../utils/map-utils';

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
        const topQuasisStart = topQuasis.node.start;
        const topExprStart = topExpr.node.start;
        if (topQuasisStart < topExprStart) {
          tempStr += topQuasis.node.value.cooked;
          quasis.shift();
        } else {
          tempStr += '{}';
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
    return ['{}', [nodePath]];
  }
  return [str, args];
}

function transformStringLiteral(nodePath, state) {
  const template = nodePath.node.value;
  const tagsNode = types.objectProperty(
    types.identifier('template'),
    types.objectExpression([
      types.objectProperty(
        types.identifier('id'),
        types.numericLiteral(Indexer.addOrGetMap('lid', template, state))
      ),
      types.objectProperty(types.identifier('value'), types.stringLiteral(template)),
    ])
  );
  nodePath.parentPath.node.arguments.shift(); // remove template
  return tagsNode;
}

function transformTemplateLiteral(nodePath, state) {
  const expressions = nodePath.get('expressions');
  const quasis = nodePath.get('quasis');

  let templateStr = '';
  while (quasis.length) {
    const topQuasis = quasis[0];
    const topExpr = expressions.length ? expressions[0] : null;
    if (topExpr) {
      // check pos
      const topQuasisStart = topQuasis.node.start;
      const topExprStart = topExpr.node.start;
      if (topQuasisStart < topExprStart) {
        templateStr += topQuasis.node.value.cooked;
        quasis.shift();
      } else {
        templateStr += '{}';
        expressions.shift();
      }
    } else {
      templateStr += topQuasis.node.value.cooked;
      quasis.shift();
    }
  }

  const allExpressions = state.types.cloneNode(nodePath.parentPath.get('arguments.0').node)
    .expressions;

  return [templateStr, allExpressions];

  // return tagsNode;
}

export default function transformLogSymbCall(nodePath, state, funcName) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);

  const targetFuncNames = state.normalizedOpts.replaceSymbFunc;
  const callee = nodePath.node.callee || undefined;
  if (!callee || !funcName || !targetFuncNames) return;

  const loc = nodePath.get('loc').node;
  const row = loc.start.line;
  const sourcemap = toPosixPath(state.currentFile)
    .split('/')
    .slice(-2)
    .join('/');

  const symbid = getSymbid(loc, state);

  // convert call func to logSymbol
  nodePath.node.callee = state.types.memberExpression(
    callee.object,
    state.types.identifier(targetFuncNames[funcName]),
    false
  );
  let tagsNode;

  // parse raw
  if (
    (funcName && funcName.endsWith('R')) ||
    (funcName.length >= 2 && funcName[funcName.length - 2] === 'R')
  ) {
    tagsNode = types.objectProperty(types.identifier('template'), types.identifier('undefined'));
  } else {
    const templateNode = nodePath.get('arguments.0');
    if (types.isStringLiteral(templateNode)) {
      tagsNode = transformStringLiteral(templateNode, state);
    } else if (types.isTemplateLiteral(templateNode)) {
      const [templateStr, expressionsArrNode] = transformTemplateLiteral(templateNode, state);
      tagsNode = types.objectProperty(
        types.identifier('template'),
        types.objectExpression([
          types.objectProperty(
            types.identifier('id'),
            types.numericLiteral(Indexer.addOrGetMap('lid', templateStr, state))
          ),
          types.objectProperty(types.identifier('value'), types.stringLiteral(templateStr)),
        ])
      );

      nodePath.node.arguments.shift();
      for (let i = expressionsArrNode.length - 1; i >= 0; i--) {
        nodePath.node.arguments.unshift(expressionsArrNode[i]);
      }
    } else if (types.isBinaryExpression(templateNode)) {
      const [templateStr, newArgs] = transformTemplateBinaryExpression(templateNode, state);
      tagsNode = types.objectProperty(
        types.identifier('template'),
        types.objectExpression([
          types.objectProperty(
            types.identifier('id'),
            types.numericLiteral(Indexer.addOrGetMap('lid', templateStr, state))
          ),
          types.objectProperty(types.identifier('value'), types.stringLiteral(templateStr)),
        ])
      );
      nodePath.node.arguments.shift();
      for (let i = newArgs.length - 1; i >= 0; i--) {
        nodePath.node.arguments.unshift(state.types.cloneNode(newArgs[i].node));
      }
    } else {
      throw new TransformSymbolLogError(funcName, `Invalid template format at ${sourcemap}:${row}`);
    }
  }

  nodePath.node.arguments.unshift(
    types.objectExpression([
      types.objectProperty(
        types.identifier('tags'),
        types.objectExpression([
          types.objectProperty(
            types.identifier('process'),
            types.stringLiteral(state.normalizedOpts.process)
          ),
          types.objectProperty(types.identifier('sourcemap'), types.stringLiteral(sourcemap)),
          types.objectProperty(types.identifier('row'), types.numericLiteral(row)),
          tagsNode,
        ])
      ),
    ])
  );

  nodePath.node.arguments.unshift(state.types.numericLiteral(symbid));
  nodePath.node.arguments.unshift(state.types.stringLiteral(funcName));
}
