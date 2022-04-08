import { getSouceMapID, getSymbid } from '../utils/map-utils';

function validLoggerAsCallee(nodePath, state) {
  if (nodePath.type === 'MemberExpression') {
    const ObjectNode = nodePath.get('object');
    return validLoggerAsCallee(ObjectNode, state);
  }
  if (nodePath.type === 'Identifier') {
    const currentSourceMapID = getSouceMapID(state.currentFile, state.SourceMap);
    const importedFrom = state.ImportMap.get(`${nodePath.node.name}:${currentSourceMapID}`);
    return (
      importedFrom &&
      state.normalizedOpts.loggerPathRegex &&
      state.normalizedOpts.loggerPathRegex.test(importedFrom)
    );
  }
  return false;
}

export default function transformLogSymbCall(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);

  const targetFuncNames = state.normalizedOpts.replaceSymbFunc;
  const callee = nodePath.node.callee || undefined;
  const funcName = callee.property && callee.property.name;
  if (!callee || !funcName || !targetFuncNames) return;
  if (!validLoggerAsCallee(nodePath.get('callee'), state)) return; // only transform props func of Logger

  const loc = nodePath.get('loc').node;
  const symbid = getSymbid(loc, state);
  
  nodePath.node.callee = state.types.memberExpression(
    callee.object,
    state.types.identifier(targetFuncNames[funcName]),
    false
  );
  nodePath.node.arguments.unshift(state.types.numericLiteral(symbid));
  nodePath.node.arguments.unshift(state.types.stringLiteral(funcName));
}
