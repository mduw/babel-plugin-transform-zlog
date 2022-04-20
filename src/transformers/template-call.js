import { types } from 'babel-core';
import { Indexer } from '../utils/log-indexer';

function transformTemplLiteral(nodePath, state, template, tags) {
  let lid;
  let fid;
  let featName = '';
  if (tags && state.types.isObjectExpression(tags)) {
    for (let i = 0; i < tags.node.properties.size; i++) {
      const item = tags.node.properties[i];
      if (item.node.key.node.name === 'featName') {
        featName = item.node.value.node.vlaue;
      }
    }
  }

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
    Indexer.currentLogData({ tags, lid, fid, process: state.normalizedOpts.process, template })
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
    let template = null;
    let tags;
    if (nodePath.get('arguments').length === 2) {
      template = nodePath.get('arguments.0').node.value;
      tags = nodePath.get('arguments.1');
    } else {
      template = nodePath.get('arguments.0').node.value;
    }

    transformTemplLiteral(nodePath, state, template, tags);
  }
}
