import { Indexer } from '../utils/log-indexer';

function transformTemplLiteral(nodePath, state, featName, template) {
  let lid;
  let fid;
  if (featName && state.FeatMap.has(featName)) {
    fid = state.FeatMap.get(featName);
  } else {
    fid = Indexer.nextFID();
    if (featName) state.FeatMap.set(featName, fid);
  }
  if (state.TemplMap.has(template)) {
    lid = state.TemplMap.get(template);
  } else {
    lid = Indexer.nextLID();
    state.TemplMap.set(template, lid);
  }
  nodePath.replaceWith(
    Indexer.currentLogData({ featName, lid, fid, process: state.normalizedOpts.process })
  );
}

export default function transformLogTemplCall(nodePath, state) {
  if (state.VisitedModules.has(nodePath)) return;
  state.VisitedModules.add(nodePath);

  const callee = nodePath.node.callee || undefined;
  const funcName = callee.property && callee.property.name;
  if (!callee || !funcName || !state.normalizedOpts.replaceCreateTemplFunc.includes(funcName))
    return;
  const parentNode = nodePath.parentPath;
  if (state.types.isCallExpression(parentNode)) {
    let template = '';
    let featName = '';
    if (nodePath.get('arguments').length === 2) {
      template = nodePath.get('arguments.0').node.value;
      featName = nodePath.get('arguments.1').node.value;
    } else {
      template = nodePath.get('arguments.0').node.value;
    }

    transformTemplLiteral(nodePath, state, featName, template);
  }
}
