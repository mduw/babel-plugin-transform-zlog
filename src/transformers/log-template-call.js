import { types } from 'babel-core';
import {
  isCallExpression,
  isNullLiteral,
  isObjectExpression,
  isUndefinedIdentifier,
} from '../utils/babel-utils';
import { Indexer } from '../utils/log-indexer';

function traverseNestedObject(nodePath, state, featName) {
  if (nodePath.node.type === 'ObjectProperty') {
    const Key = nodePath.get('key').node.name;
    if (isObjectExpression(nodePath.get('value'))) {
      const value = traverseNestedObject(nodePath.get('value'), state);
      return types.objectProperty(types.identifier(Key), value);
    }
    if (
      isCallExpression(nodePath.get('value')) &&
      state.normalizedOpts.replaceCreateTemplFunc.includes(
        nodePath.get('value').get('callee').node.name
      )
    ) {
      const RawTemplate = nodePath.get('value').get('arguments.0').node.value;
      let lid;

      if (state.TemplMap.has(RawTemplate)) {
        lid = state.TemplMap.get(RawTemplate);
      } else {
        lid = Indexer.nextLID();
        state.TemplMap.set(RawTemplate, lid);
      }
      return types.objectProperty(types.identifier(Key), Indexer.currentLogData({ featName, lid }));
    }
  } else if (nodePath.node.type === 'ObjectExpression') {
    const obj = [];
    nodePath.get('properties').forEach(item => {
      obj.push(traverseNestedObject(item, state, featName));
    });
    return types.objectExpression([...obj]);
  }
  return nodePath;
}

function transformTemplArrowExpCall(nodePath, state, featName) {
  const RetNode = nodePath.get('body').get('properties');
  const obj = [];
  for (let i = 0; i < RetNode.length; i++) {
    obj.push(traverseNestedObject(RetNode[i], state, featName));
  }
  return types.objectExpression([...obj]);
}

function transformTemplFuncExpCall(nodePath, state, featName) {
  const BodyNode = nodePath.get('body').get('body');
  const RetNode = BodyNode[BodyNode.length - 1].get('argument').get('properties');

  const obj = [];
  for (let i = 0; i < RetNode.length; i++) {
    obj.push(traverseNestedObject(RetNode[i], state, featName));
  }
  return types.objectExpression([...obj]);
}

function transformTemplLiteral(nodePath, state, featName) {
  const RawTemplate = nodePath.node.value;

  let lid;
  if (state.TemplMap.has(RawTemplate)) {
    lid = state.TemplMap.get(RawTemplate);
  } else {
    lid = Indexer.nextLID();
    state.TemplMap.set(RawTemplate, lid);
  }
  return Indexer.currentLogData({ featName, lid });
}

function doTransformNode(node, newNode) {
  switch (node.type) {
    case 'ObjectProperty': {
      node.get('value').replaceWith(newNode);
      break;
    }
    case 'VariableDeclarator': {
      node.get('init').replaceWith(newNode);
      break;
    }
    default: {
      break;
    }
  }
}

export default function transformLogTemplCall(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);

  const callee = nodePath.node.callee || undefined;
  const funcName = callee.property && callee.property.name;
  if (!callee || !funcName) return;

  const featNameNode = nodePath.get('arguments.0');
  const featName = featNameNode.node.value
    ? featNameNode.node.value
    : isUndefinedIdentifier(featNameNode)
    ? undefined
    : isNullLiteral(featNameNode)
    ? null
    : '';

  const CallbackNode = nodePath.get('arguments.1');
  switch (CallbackNode.node.type) {
    case 'FunctionExpression': {
      const RetObjNode = transformTemplFuncExpCall(CallbackNode, state, featName);
      doTransformNode(nodePath.parentPath, RetObjNode);
      break;
    }
    case 'ArrowFunctionExpression': {
      const RetObjNode = transformTemplArrowExpCall(CallbackNode, state, featName);
      doTransformNode(nodePath.parentPath, RetObjNode);
      break;
    }

    case 'StringLiteral': {
      const RetObjNode = transformTemplLiteral(CallbackNode, state, featName);
      doTransformNode(nodePath.parentPath, RetObjNode);
      break;
    }
    default: {
      break;
    }
  }
}
