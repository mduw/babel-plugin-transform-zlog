import { types } from 'babel-core';
import { TransformTemplateError } from '../errors/errors';
import { UIDManager } from '../utils/id-gen';
import { Indexer } from '../utils/log-indexer';
import { EnumeratedLevels, EnumeratedLevelsName } from '../utils/log-levels/enumerator';
import { isBinaryMode, isTextMode } from '../utils/parse-mode';
import { isGlobalIdentifier } from '../utils/verify-identifier';

const PlaceholderSign = '{}';

export function transformStringLiteral(nodePath, state) {
  return types.stringLiteral(Indexer.addOrGetMap(Indexer.keys.templ, nodePath.node.value, state));
}

export function transformTemplateLiteral(nodePath, state, args) {
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
        let num = topQuasis.node.value.cooked.split(PlaceholderSign).length-1;
        while(num && args.length) {
          NewExp.push(args[0]);
          args.shift();
          num -= 1;
        }
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
  if(args.length) {
    args.forEach(arg => NewExp.push(arg));
  }

  return [templateStr, NewExp];
}

function transformTemplTagExpression(nodePath, state, args) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);
  const currentTag = nodePath.get('tag');
  const currentQuasi = nodePath.get('quasi');
  const params = [];

  if (
    currentTag.node.name === state.normalizedOpts.templateFunc &&
    types.isTemplateLiteral(currentQuasi)
    && isGlobalIdentifier(state.programPath, state.normalizedOpts.templateFunc)
  ) {
    const [templateStr, expressionArrNode] = transformTemplateLiteral(currentQuasi, state, args);
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
  const targetFuncNames = EnumeratedLevelsName;
  const callee = nodePath.node.callee || undefined;
  if (!callee || !funcName || !targetFuncNames) return;

  const loc = nodePath.get('loc').node;
  const row = loc.start.line;
  // convert call func to logSymbol
  nodePath.node.callee = state.types.memberExpression(
    callee.object,
    state.types.identifier('zsymb'),
    false
  );

  const CallExpArgs = nodePath.get('arguments');
  const FirstExpArg = CallExpArgs[0];
  if (types.isTaggedTemplateExpression(FirstExpArg)) {
    const params = transformTemplTagExpression(FirstExpArg, state, nodePath.get('arguments').slice(1,));
    // if (params.length) {
    //   nodePath.node.arguments.shift();
    //   for (let i = params.length - 1; i >= 0; i--) {
    //     nodePath.node.arguments.unshift(params[i]);
    //   }
    // }
    nodePath.node.arguments = params;
    nodePath.node.arguments.unshift(types.numericLiteral(row));
    nodePath.node.arguments.unshift(types.numericLiteral(EnumeratedLevels[funcName.concat('T')]));
  } else if (
    types.isCallExpression(FirstExpArg) &&
    types.isIdentifier(FirstExpArg.get('callee')) &&
    FirstExpArg.get('callee').node.name === state.normalizedOpts.templateFunc
  ) {
    const argCallee = FirstExpArg.get('callee').node;
    if (FirstExpArg.node.arguments.length !== 1) throw new TransformTemplateError(argCallee.name, 'More than 1 string detected');

    const firstExpArgsArgs = FirstExpArg.get('arguments.0');
    const params = [];
    if (types.isStringLiteral(firstExpArgsArgs)) {
      params.push(...nodePath.get('arguments').map(node => state.types.cloneNode(node.node)));
      params.shift();
      params.unshift(transformStringLiteral(firstExpArgsArgs, state));
    } else if (types.isTemplateLiteral(firstExpArgsArgs)) {
      const [templateStr, expressionArrNode] = transformTemplateLiteral(firstExpArgsArgs, state, nodePath.get('arguments').slice(1,));
     
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
    // if (params.length) {
    //   nodePath.node.arguments.shift();
    //   for (let i = params.length - 1; i >= 0; i--) {
    //     nodePath.node.arguments.unshift(params[i]);
    //   }
    // }
    nodePath.node.arguments = params;
    nodePath.node.arguments.unshift(types.numericLiteral(row));
    nodePath.node.arguments.unshift(types.numericLiteral(EnumeratedLevels[funcName.concat('T')]));
  } else {
    nodePath.node.arguments.unshift(types.numericLiteral(row));
    nodePath.node.arguments.unshift(types.numericLiteral(EnumeratedLevels[funcName]));
  }
}
