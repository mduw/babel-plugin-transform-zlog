import transformLogSymbCall from './log-symb-call';
import transformLogTemplCall from './log-template-call';
import { Indexer } from '../utils/log-indexer';

export default function transformCall(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;

  const callee = nodePath.node.callee || undefined;
  const funcName = callee.property && callee.property.name;
  if (!callee || !funcName) return;

  const targetFuncNames = state.normalizedOpts.replaceSymbFunc;

  if (funcName && state.types.isMemberExpression(callee)) {
    if (state.normalizedOpts.replaceCreateFeatFunc.includes(callee.property.name)) {
      Indexer.nextFID();
      transformLogTemplCall(nodePath, state);
    } else if (Object.prototype.hasOwnProperty.call(targetFuncNames, funcName)) {
      transformLogSymbCall(nodePath, state);
    }
  }
}
