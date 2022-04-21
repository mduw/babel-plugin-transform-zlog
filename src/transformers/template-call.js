import { types } from 'babel-core';
import { toPosixPath } from '../utils/file-utils';
import { Indexer } from '../utils/log-indexer';

function transformTemplLiteral(nodePath, state, template, tags) {
  let lid;
  let fid;
  let featName = '';
  if (tags && state.types.isObjectExpression(tags)) {
    for (let i = 0; i < tags.node.properties.length; i++) {
      const item = tags.get(`properties.${i}`);
      if (item.get('key').node.name === 'featName') {
        featName = item.get('value').node.value;
        break;
      }
    }
  }

  if (featName && state.FeatMap.has(featName)) {
    fid = state.FeatMap.get(featName);
  } else {
    fid = Indexer.nextFID();
    if (featName) state.FeatMap.set(featName, fid);
    else state.FeatMap.set(`${fid}`, fid);
  }

  if (state.TemplMap.has(template)) {
    lid = state.TemplMap.get(template);
  } else {
    lid = Indexer.nextLID();
    state.TemplMap.set(template, lid);
  }
  const loc = nodePath.get('loc').node;
  const row = loc.start.line;
  const sourcemap = toPosixPath(state.currentFile)
    .split('/')
    .slice(-2)
    .join('/');

  nodePath.replaceWith(
    Indexer.currentLogData({
      tags,
      lid,
      fid,
      process: state.normalizedOpts.process,
      template,
      sourcemap,
      row,
    })
  );
}

function extractTemplate(nodePath) {
  let template = '';
  if(types.isStringLiteral(nodePath)) {
    template = nodePath.node.value;
  } else if(types.isTemplateLiteral(nodePath)) {
    template = nodePath.node.value.raw;
  }

  return template;
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
      template = extractTemplate(nodePath.get('arguments.0'));
      tags = nodePath.get('arguments.1');
    } else {
      template = extractTemplate(nodePath.get('arguments.0'));
    }

    transformTemplLiteral(nodePath, state, template, tags);
  }
}
